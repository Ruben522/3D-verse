import prisma from "../config/prisma.js";
import fs from "fs";
import path from "path";
import { checkPermission } from "../utils/checkPermission.js";
import { getAbsolutePath } from "../utils/helper/file.helper.js";

/**
 * Registra una descarga del modelo en la base de datos y actualiza el contador
 * de descargas totales del modelo de forma atómica (transacción).
 * Devuelve también la URL del archivo para que el cliente pueda proceder con la descarga.
 *
 * @param {string} modelId - ID del modelo que se está descargando
 * @param {Object|null} user - Objeto del usuario autenticado (null si es descarga anónima)
 * @param {string} ip - Dirección IP del cliente (para registro y prevención de abuso)
 * @param {string} userAgent - Cadena User-Agent del navegador o cliente
 * @returns {Promise<{
 *   message: string,
 *   downloads_count: number,
 *   file_url: string
 * }>} Información de confirmación y datos necesarios para la descarga
 * @throws {Error} "El modelo solicitado no existe" (código P2025)
 * @throws {Error} Error genérico de base de datos si ocurre otro problema
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
        if (error.code === "P2025") {
            throw new Error(
                "El modelo solicitado no existe",
            );
        }
        throw error;
    }
};

/**
 * Obtiene el historial paginado de descargas realizadas por un usuario específico.
 * Solo muestra descargas registradas (no anónimas).
 *
 * @param {string} userId - ID del usuario cuyos descargas se consultan
 * @param {Object} [options] - Opciones de paginación
 * @param {number} [options.page=1] - Página solicitada (base 1)
 * @param {number} [options.limit=20] - Cantidad de registros por página (máx. 50)
 * @returns {Promise<{
 *   page: number,
 *   limit: number,
 *   total: number,
 *   totalPages: number,
 *   data: Array<{
 *     download_id: string,
 *     download_date: Date,
 *     model_id: string,
 *     title: string,
 *     main_image_url: string|null
 *   }>
 * }>} Resultado paginado con información básica de los modelos descargados
 */
const getDownloadsHistory = async (
    userId,
    { page = 1, limit = 20 } = {},
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
 * Obtiene estadísticas detalladas de descargas de un modelo específico.
 * Solo accesible por el creador del modelo o administradores.
 * Incluye total, descargas registradas, usuarios únicos y descargas anónimas.
 *
 * @param {string} modelId - ID del modelo cuyas estadísticas se consultan
 * @param {Object} user - Usuario autenticado que realiza la consulta
 * @returns {Promise<{
 *   total_downloads: number,
 *   unique_users: number,
 *   registered_downloads: number,
 *   anonymous_downloads: number
 * }>} Estadísticas de descargas
 * @throws {Error} "El modelo solicitado no existe"
 * @throws {Error} Si el usuario no tiene permiso (propietario o admin)
 */
const getModelDownloadStats = async (modelId, user) => {
    const model = await prisma.models.findUnique({
        where: { id: modelId },
    });

    if (!model) {
        throw new Error("El modelo solicitado no existe");
    }

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
 * Obtiene información necesaria para servir el archivo de descarga:
 * ruta absoluta en disco, nombre limpio sugerido y carpeta del modelo.
 * Verifica que el archivo físico exista antes de retornar.
 *
 * @param {string} modelId - ID del modelo cuyo archivo se va a descargar
 * @returns {Promise<{
 *   absolutePath: string,
 *   cleanName: string,
 *   modelFolder: string
 * }>} Información para servir el archivo
 * @throws {Error} "El modelo solicitado no existe"
 * @throws {Error} "El archivo físico no existe en el servidor" si el archivo no se encuentra
 */
const getDownloadInfo = async (modelId) => {
    const model = await prisma.models.findUnique({
        where: { id: modelId },
        select: { title: true, file_url: true },
    });

    if (!model) {
        throw new Error("El modelo solicitado no existe");
    }

    const absolutePath = getAbsolutePath(model.file_url);

    if (!absolutePath || !fs.existsSync(absolutePath)) {
        throw new Error(
            "El archivo físico no existe en el servidor",
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
