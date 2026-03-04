import {
    addTagToModel,
    removeTagFromModel,
    getAllTags,
    removeTag,
    getTagsForModel,
} from "../services/tags.service.js";
import {
    sendSuccess,
    sendError,
} from "../utils/helper/response.helper.js";

/**
 * Obtiene todos los tags asociados a un modelo.
 */
const getForModel = async (req, res) => {
    try {
        const tags = await getTagsForModel(
            req.params.modelId,
        );
        sendSuccess(
            res,
            "Tags del modelo recuperados",
            tags,
        );
    } catch (error) {
        sendError(res, error.message, 404);
    }
};

/**
 * Añade un nuevo tag a un modelo.
 */
const addToModel = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || name.trim() === "") {
            return sendError(res, "Tag inválido", 400);
        }

        const result = await addTagToModel(
            req.params.modelId,
            req.user,
            name,
        );

        sendSuccess(res, result.message, result.tag);
    } catch (error) {
        const status =
            error.message === "Modelo no encontrado"
                ? 404
                : 400;
        sendError(res, error.message, status);
    }
};

/**
 * Elimina un tag de un modelo.
 */
const removeFromModel = async (req, res) => {
    try {
        const result = await removeTagFromModel(
            req.params.modelId,
            req.params.tagId,
            req.user,
        );

        sendSuccess(res, result.message);
    } catch (error) {
        const status =
            error.message === "Modelo no encontrado"
                ? 404
                : 403;
        sendError(res, error.message, status);
    }
};

/**
 * Obtiene todos los tags creados en la plataforma.
 */
const getAll = async (req, res) => {
    try {
        const tags = await getAllTags();
        sendSuccess(
            res,
            "Todos los tags recuperados",
            tags,
        );
    } catch (error) {
        sendError(res, error.message, 500);
    }
};

/**
 * Elimina un tag permanentemente de la plataforma (Solo Admin).
 */
const remove = async (req, res) => {
    try {
        const result = await removeTag(
            req.params.tagId,
            req.user,
        );

        sendSuccess(res, result.message);
    } catch (error) {
        const status =
            error.message === "Tag no encontrado"
                ? 404
                : 403;
        sendError(res, error.message, status);
    }
};

export {
    addToModel,
    removeFromModel,
    getAll,
    remove,
    getForModel,
};
