import prisma from "../config/prisma.js";
import { checkPermission } from "../utils/checkPermission.js";

const createPart = async (user, modelId, data) => {
    const { color, part_name, file_url, file_size } = data;

    if (!part_name || typeof part_name !== "string" || part_name.trim() === "") {
        throw new Error("El nombre de la pieza es obligatorio.");
    }
    if (!file_url || typeof file_url !== "string" || file_url.trim() === "") {
        throw new Error("La URL/ruta del archivo de la pieza es obligatoria.");
    }

    const model = await prisma.models.findUnique({
        where: { id: modelId },
        select: { user_id: true },
    });

    if (!model) throw new Error("Modelo no encontrado.");

    checkPermission(model.user_id, user);

    const newPart = await prisma.model_parts.create({
        data: {
            model_id: modelId,
            color: color || null,
            part_name: part_name.trim(),
            file_url: file_url.trim(),
            file_size: file_size || null,
        },
    });

    return newPart;
};

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

const getPartsByModelId = async (modelId) => {
    const parts = await prisma.model_parts.findMany({
        where: { model_id: modelId },
        orderBy: { created_at: "asc" },
    });
    return parts;
};

const deletePart = async (partId, user) => {
    const part = await prisma.model_parts.findUnique({
        where: { id: partId },
        include: { models: { select: { user_id: true } } },
    });

    if (!part) throw new Error("Parte no encontrada.");

    checkPermission(part.models.user_id, user);

    await prisma.model_parts.delete({
        where: { id: partId },
    });

    return { message: "Parte eliminada correctamente." };
};

export { createPart, getParts, getPartsByModelId, deletePart };