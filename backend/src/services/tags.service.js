import prisma from "../config/prisma.js";
import { checkPermission } from "../utils/checkPermission.js";
import { syncModelToMeili } from "../server/meilisearchSync.js";
import { getModelById } from "./models.service.js";

/**
 * Normaliza el nombre de un tag: elimina espacios al inicio y final y convierte todo a minúsculas.
 * Se usa para mantener consistencia en los nombres de tags.
 *
 * @param {string} name - Nombre del tag a normalizar
 * @returns {string} El nombre normalizado (minúsculas, sin espacios sobrantes)
 */
const normalizeTag = (name) => {
    return name.trim().toLowerCase();
};

/**
 * Obtiene todos los tags asociados a un modelo específico.
 *
 * @param {string} modelId - ID del modelo cuyos tags se desean recuperar
 * @returns {Promise<Array<{ id: string, name: string }>>} Lista de tags asociados al modelo, ordenados alfabéticamente
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
 * Añade un tag a un modelo. Si el tag no existe en el sistema, lo crea automáticamente.
 * Solo el propietario del modelo o un administrador puede ejecutar esta acción.
 *
 * @param {string} modelId - ID del modelo al que se añadirá el tag
 * @param {Object} user - Objeto del usuario autenticado que realiza la acción
 * @param {string} tagName - Nombre del tag a añadir (se normalizará internamente)
 * @returns {Promise<{ message: string, tag?: { id: string, name: string } }>}
 *          Resultado de la operación: mensaje de éxito y el tag creado/usado (si aplica)
 * @throws {Error} "Modelo no encontrado" si el modelo no existe
 * @throws {Error} Si el usuario no tiene permiso sobre el modelo
 * @throws {Error} Error genérico de base de datos si ocurre otro problema
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

        const modeloActualizado = await getModelById(modelId);
        await syncModelToMeili(modeloActualizado);
        return {
            message: "Tag añadido correctamente",
            tag,
        };
    } catch (error) {
        if (error.code === "P2002") {
            return {
                message: "El modelo ya tenía este tag asignado",
            };
        }
        throw error;
    }
};

/**
 * Elimina la relación entre un tag y un modelo específico.
 * Solo el propietario del modelo o un administrador puede realizar esta acción.
 *
 * @param {string} modelId - ID del modelo del que se quitará el tag
 * @param {string} tagId - ID del tag a remover del modelo
 * @param {Object} user - Objeto del usuario autenticado que realiza la acción
 * @returns {Promise<{ message: string }>} Mensaje de resultado de la operación
 * @throws {Error} "Modelo no encontrado" si el modelo no existe
 * @throws {Error} Si el usuario no tiene permiso sobre el modelo
 * @throws {Error} Error genérico de base de datos si ocurre otro problema
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
        if (error.code === "P2025") {
            return {
                message: "El tag no existía en el modelo",
            };
        }
        throw error;
    }
};

/**
 * Elimina un tag completamente del sistema (incluyendo todas sus relaciones con modelos).
 * Acción restringida exclusivamente a usuarios con rol de administrador.
 *
 * @param {string} tagId - ID del tag a eliminar
 * @param {Object} user - Objeto del usuario autenticado (debe ser admin)
 * @returns {Promise<{ message: string }>} Mensaje de confirmación
 * @throws {Error} "Acción permitida solo para administradores" si el usuario no es admin
 * @throws {Error} "Tag no encontrado" si el tag no existe
 * @throws {Error} Error genérico de base de datos si ocurre otro problema
 */
const removeTag = async (tagId, user) => {
    if (user.role !== "admin") {
        throw new Error("Acción permitida solo para administradores");
    }

    try {
        await prisma.tags.delete({ where: { id: tagId } });
        return { message: "Tag eliminado del sistema" };
    } catch (error) {
        if (error.code === "P2025") {
            throw new Error("Tag no encontrado");
        }
        throw error;
    }
};

/**
 * Obtiene la lista completa de todos los tags existentes en el sistema.
 * Útil para autocompletado, listas desplegables o mostrar tags populares.
 *
 * @returns {Promise<Array<{ id: string, name: string }>>} Lista de todos los tags, ordenados alfabéticamente
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
