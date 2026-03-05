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
 * Obtiene todos los tags asociados a un modelo específico.
 * Endpoint público.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const getForModel = async (req, res) => {
    try {
        const tags = await getTagsForModel(
            req.params.modelId,
        );
        sendSuccess(
            res,
            "Tags del modelo recuperados.",
            tags,
        );
    } catch (error) {
        sendError(res, error.message, 404);
    }
};

/**
 * Añade un nuevo tag (o usa uno existente) a un modelo.
 * Requiere autenticación y que el usuario sea propietario del modelo o admin.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const addToModel = async (req, res) => {
    try {
        const { name } = req.body;

        if (
            !name ||
            typeof name !== "string" ||
            name.trim() === ""
        ) {
            return sendError(
                res,
                "El nombre del tag es obligatorio.",
                400,
            );
        }

        const result = await addTagToModel(
            req.params.modelId,
            req.user,
            name.trim(),
        );

        sendSuccess(
            res,
            result.message,
            result.tag || null,
        );
    } catch (error) {
        const status = error.message.includes(
            "Modelo no encontrado",
        )
            ? 404
            : 400;
        sendError(res, error.message, status);
    }
};

/**
 * Elimina la asociación de un tag específico con un modelo.
 * Requiere autenticación y que el usuario sea propietario del modelo o admin.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
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
        const status = error.message.includes(
            "Modelo no encontrado.",
        )
            ? 404
            : 403;
        sendError(res, error.message, status);
    }
};

/**
 * Obtiene la lista completa de todos los tags existentes en la plataforma.
 * Ordenados alfabéticamente. Endpoint público.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const getAll = async (req, res) => {
    try {
        const tags = await getAllTags();
        sendSuccess(
            res,
            "Todos los tags recuperados.",
            tags,
        );
    } catch (error) {
        sendError(res, error.message, 500);
    }
};

/**
 * Elimina un tag permanentemente del sistema (incluyendo todas sus asociaciones).
 * Requiere rol de administrador.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const remove = async (req, res) => {
    try {
        const result = await removeTag(
            req.params.tagId,
            req.user,
        );
        sendSuccess(res, result.message);
    } catch (error) {
        const status = error.message.includes(
            "Tag no encontrado.",
        )
            ? 404
            : 403;
        sendError(res, error.message, status);
    }
};

export {
    getForModel,
    addToModel,
    removeFromModel,
    getAll,
    remove,
};
