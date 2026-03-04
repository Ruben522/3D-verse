import prisma from "../config/prisma.js";
import fs from "fs";
import path from "path";
import { checkPermission } from "../utils/checkPermission.js";

/**
 * Añade una nueva pieza (parte) a un modelo existente.
 * @param {Object} user - El usuario autenticado (para verificar permisos).
 * @param {string} modelId - El ID del modelo padre.
 * @param {Object} data - Datos de la pieza (color, part_name, file_url, file_size).
 * @returns {Promise<Object>} La pieza recién insertada.
 */
const createPart = async (user, modelId, data) => {
    const { color, part_name, file_url, file_size } = data;

    const model = await prisma.models.findUnique({
        where: { id: modelId },
        select: { user_id: true },
    });

    if (!model) throw new Error("Modelo no encontrado");

    checkPermission(model.user_id, user);

    const newPart = await prisma.model_parts.create({
        data: {
            model_id: modelId,
            color: color || null,
            part_name,
            file_url,
            file_size,
        },
    });

    return newPart;
};

/**
 * Obtiene todas las piezas registradas (paginado, para propósitos administrativos).
 */
const getParts = async ({ page = 1, limit = 20 }) => {
    const safeLimit = Math.min(limit, 50);
    const offset = (page - 1) * safeLimit;

    const [total, partsList] = await prisma.$transaction([
        prisma.model_parts.count(),
        prisma.model_parts.findMany({
            orderBy: { created_at: "desc" },
            skip: offset,
            take: safeLimit,
        }),
    ]);

    return {
        page,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
        data: partsList,
    };
};

/**
 * Obtiene todas las piezas asociadas a un modelo específico.
 * @param {string} modelId - El ID del modelo.
 */
const getPartsByModelId = async (modelId) => {
    const parts = await prisma.model_parts.findMany({
        where: { model_id: modelId },
        orderBy: { created_at: "asc" },
    });
    return parts;
};

/**
 * Elimina una pieza específica tanto de la base de datos como del sistema de archivos.
 * @param {string} partId - El ID de la pieza a eliminar.
 * @param {Object} user - El usuario autenticado.
 */
const deletePart = async (partId, user) => {
    const part = await prisma.model_parts.findUnique({
        where: { id: partId },
        include: { models: { select: { user_id: true } } },
    });

    if (!part) throw new Error("Parte no encontrada");

    checkPermission(part.models.user_id, user);

    await prisma.model_parts.delete({
        where: { id: partId },
    });

    const relativePath = path.normalize(
        part.file_url.startsWith("/")
            ? part.file_url.slice(1)
            : part.file_url,
    );
    const absolutePath = path.resolve(
        process.cwd(),
        relativePath,
    );

    try {
        if (fs.existsSync(absolutePath)) {
            fs.unlinkSync(absolutePath);
            console.log(
                "-> Pieza eliminada físicamente:",
                absolutePath,
            );
        }
    } catch (fsError) {
        console.error(
            "-> Error al borrar pieza física:",
            fsError,
        );
    }

    return { message: "Parte eliminada correctamente" };
};

export {
    createPart,
    getParts,
    getPartsByModelId,
    deletePart,
};
