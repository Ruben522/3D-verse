import prisma from "../config/prisma.js";
import fs from "fs";
import path from "path";
import { checkPermission } from "../utils/checkPermission.js";
import { getAbsolutePath } from "../utils/helper/file.helper.js";

/**
 * Registra una descarga en el historial y actualiza el contador global del modelo de forma atómica.
 * @param {string} modelId - ID del modelo descargado.
 * @param {Object|null} user - Usuario que descarga (null si es anónimo).
 * @param {string} ip - Dirección IP del cliente.
 * @param {string} userAgent - Navegador/Software usado.
 */
const recordDownload = async (
    modelId,
    user,
    ip,
    userAgent,
) => {
    try {
        const [downloadRecord, updatedModel] =
            await prisma.$transaction([
                prisma.downloads.create({
                    data: {
                        model_id: modelId,
                        user_id: user ? user.id : null,
                        ip_address: ip,
                        user_agent: userAgent,
                    },
                }),
                prisma.models.update({
                    where: { id: modelId },
                    data: { downloads: { increment: 1 } },
                    select: {
                        downloads: true,
                        file_url: true,
                    },
                }),
            ]);

        return {
            message: "Descarga registrada correctamente",
            downloads_count: updatedModel.downloads,
            file_url: updatedModel.file_url,
        };
    } catch (error) {
        if (error.code === "P2025")
            throw new Error(
                "El modelo solicitado no existe",
            );
        throw error;
    }
};

/**
 * Obtiene el historial paginado de descargas de un usuario.
 */
const getDownloadsHistory = async (
    userId,
    { page = 1, limit = 20 },
) => {
    const safeLimit = Math.min(limit, 50);
    const offset = (page - 1) * safeLimit;

    const [total, downloads] = await prisma.$transaction([
        prisma.downloads.count({
            where: { user_id: userId },
        }),
        prisma.downloads.findMany({
            where: { user_id: userId },
            select: {
                id: true,
                created_at: true,
                models: {
                    select: {
                        id: true,
                        title: true,
                        main_image_url: true,
                    },
                },
            },
            orderBy: { created_at: "desc" },
            skip: offset,
            take: safeLimit,
        }),
    ]);

    const formattedData = downloads.map((d) => ({
        download_id: d.id,
        download_date: d.created_at,
        model_id: d.models.id,
        title: d.models.title,
        main_image_url: d.models.main_image_url,
    }));

    return {
        page,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
        data: formattedData,
    };
};

/**
 * Obtiene las estadísticas de descargas de un modelo (solo para el creador).
 */
const getModelDownloadStats = async (modelId, user) => {
    const model = await prisma.models.findUnique({
        where: { id: modelId },
    });
    if (!model)
        throw new Error("El modelo solicitado no existe");

    checkPermission(model.user_id, user);

    const total_downloads = await prisma.downloads.count({
        where: { model_id: modelId },
    });

    const registered_downloads =
        await prisma.downloads.count({
            where: {
                model_id: modelId,
                user_id: { not: null },
            },
        });

    const uniqueUsersGroup = await prisma.downloads.groupBy(
        {
            by: ["user_id"],
            where: {
                model_id: modelId,
                user_id: { not: null },
            },
        },
    );

    return {
        total_downloads,
        unique_users: uniqueUsersGroup.length,
        registered_downloads,
        anonymous_downloads:
            total_downloads - registered_downloads,
    };
};

/**
 * Obtiene las rutas físicas absolutas para procesar la descarga.
 */
const getDownloadInfo = async (modelId) => {
    const model = await prisma.models.findUnique({
        where: { id: modelId },
        select: { title: true, file_url: true },
    });

    if (!model)
        throw new Error("El modelo solicitado no existe");

    const absolutePath = getAbsolutePath(model.file_url);

    if (!absolutePath || !fs.existsSync(absolutePath)) {
        throw new Error(
            `El archivo físico no existe en el servidor.`,
        );
    }

    const extension = path.extname(model.file_url);
    const cleanName = `${model.title.replace(/\s/g, "_")}${extension}`;

    return {
        absolutePath,
        cleanName,
        modelFolder: path.dirname(absolutePath),
    };
};

export {
    recordDownload,
    getDownloadsHistory,
    getModelDownloadStats,
    getDownloadInfo,
};
