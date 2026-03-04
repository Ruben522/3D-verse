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
    // Buscamos en la tabla intermedia model_tag y extraemos los datos de la tabla tags
    const result = await prisma.model_tag.findMany({
        where: { model_id: modelId },
        include: {
            tags: { select: { id: true, name: true } },
        },
        orderBy: { tags: { name: "asc" } },
    });

    // Aplanamos el resultado para que el frontend reciba un array de objetos { id, name }
    return result.map((mt) => mt.tags);
};

/**
 * Añade un tag a un modelo (lo crea si no existe).
 */
const addTagToModel = async (modelId, user, tagName) => {
    const normalizedName = normalizeTag(tagName);

    // 1. Verificamos que el modelo exista y que el usuario tenga permisos
    const model = await prisma.models.findUnique({
        where: { id: modelId },
        select: { user_id: true },
    });

    if (!model) throw new Error("Modelo no encontrado");
    checkPermission(model.user_id, user);

    try {
        // 2. Transacción atómica: Crear/Obtener tag y enlazarlo
        const [tag] = await prisma.$transaction([
            // Upsert: Actualiza si existe, crea si no existe (basado en el campo @unique name)
            prisma.tags.upsert({
                where: { name: normalizedName },
                update: {}, // No hacemos nada si ya existe
                create: { name: normalizedName },
            }),
        ]);

        // 3. Añadimos a la tabla puente (usamos create porque @@id compuesto nos protege de duplicados)
        await prisma.model_tag.create({
            data: { model_id: modelId, tag_id: tag.id },
        });

        return {
            message: "Tag añadido correctamente",
            tag,
        };
    } catch (error) {
        // P2002 en model_tag significa que el modelo ya tenía ese tag asignado
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
    // 1. Verificamos modelo y permisos
    const model = await prisma.models.findUnique({
        where: { id: modelId },
        select: { user_id: true },
    });

    if (!model) throw new Error("Modelo no encontrado");
    checkPermission(model.user_id, user);

    try {
        // 2. Borramos la relación en la tabla puente
        await prisma.model_tag.delete({
            where: {
                model_id_tag_id: {
                    // Clave primaria compuesta generada por Prisma
                    model_id: modelId,
                    tag_id: tagId,
                },
            },
        });
        return { message: "Tag eliminado del modelo" };
    } catch (error) {
        // P2025: La relación no existía
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
    // Tu lógica de permisos de administrador
    if (user.role !== "admin")
        throw new Error(
            "Acción permitida solo para administradores",
        );

    try {
        // Borramos el tag. (ON DELETE CASCADE en model_tag limpiará las relaciones huérfanas)
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
