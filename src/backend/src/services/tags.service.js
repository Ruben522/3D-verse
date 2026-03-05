import prisma from "../config/prisma.js";
import { checkPermission } from "../utils/checkPermission.js";

/**
 * Normaliza un tag (minúsculas y sin espacios al inicio/fin).
 */
const normalizeTag = (name) => {
    return name.trim().toLowerCase();
};

/**
 * Obtiene todos los tags asociados a un modelo.
 * @param {string} modelId - ID del modelo.
 */
const getTagsForModel = async (modelId) => {
    const result = await prisma.model_tag.findMany({
        where: { model_id: modelId },
        include: {
            tags: { select: { id: true, name: true } },
        },
        orderBy: { tags: { name: "asc" } },
    });

    return result.map((mt) => mt.tags);
};

/**
 * Añade un tag a un modelo (lo crea si no existe).
 */
const addTagToModel = async (modelId, user, tagName) => {
    const normalizedName = normalizeTag(tagName);

    const model = await prisma.models.findUnique({
        where: { id: modelId },
        select: { user_id: true },
    });

    if (!model) throw new Error("Modelo no encontrado");
    checkPermission(model.user_id, user);

    try {
        const [tag] = await prisma.$transaction([
            prisma.tags.upsert({
                where: { name: normalizedName },
                update: {},
                create: { name: normalizedName },
            }),
        ]);

        await prisma.model_tag.create({
            data: { model_id: modelId, tag_id: tag.id },
        });

        return {
            message: "Tag añadido correctamente",
            tag,
        };
    } catch (error) {
        if (error.code === "P2002") {
            return {
                message:
                    "El modelo ya tenía este tag asignado",
            };
        }
        throw error;
    }
};

/**
 * Elimina un tag de un modelo específico.
 */
const removeTagFromModel = async (modelId, tagId, user) => {
    const model = await prisma.models.findUnique({
        where: { id: modelId },
        select: { user_id: true },
    });

    if (!model) throw new Error("Modelo no encontrado");
    checkPermission(model.user_id, user);

    try {
        await prisma.model_tag.delete({
            where: {
                model_id_tag_id: {
                    model_id: modelId,
                    tag_id: tagId,
                },
            },
        });
        return { message: "Tag eliminado del modelo" };
    } catch (error) {
        if (error.code === "P2025")
            return {
                message: "El tag no existía en el modelo",
            };
        throw error;
    }
};

/**
 * Elimina un tag del sistema por completo (Solo Admin).
 */
const removeTag = async (tagId, user) => {
    if (user.role !== "admin")
        throw new Error(
            "Acción permitida solo para administradores",
        );

    try {
        await prisma.tags.delete({ where: { id: tagId } });
        return { message: "Tag eliminado del sistema" };
    } catch (error) {
        if (error.code === "P2025")
            throw new Error("Tag no encontrado");
        throw error;
    }
};

/**
 * Obtiene la lista completa de tags del sistema.
 */
const getAllTags = async () => {
    const tags = await prisma.tags.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
    });
    return tags;
};

export {
    addTagToModel,
    removeTagFromModel,
    removeTag,
    getAllTags,
    getTagsForModel,
};
