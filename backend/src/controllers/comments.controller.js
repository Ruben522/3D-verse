import {
    createComment,
    getModelComments,
    updateComment,
    deleteComment,
    replyToComment,
} from "../services/comments.service.js";
import {
    sendSuccess,
    sendError,
} from "../utils/helper/response.helper.js";

/**
 * Crea un nuevo comentario en un modelo específico.
 * Requiere autenticación.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const create = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content || content.trim() === "") {
            return sendError(
                res,
                "El comentario no puede estar vacío.",
                400,
            );
        }

        const comment = await createComment(
            req.params.modelId,
            req.user.id,
            content.trim(),
        );

        sendSuccess(
            res,
            "Comentario publicado correctamente.",
            comment,
            201,
        );
    } catch (error) {
        const status = error.message.includes(
            "El modelo solicitado no existe",
        )
            ? 404
            : 400;
        sendError(res, error.message + ".", status);
    }
};

/**
 * Obtiene los comentarios de un modelo de forma paginada.
 * Ordenados por fecha descendente (más recientes primero).
 * Endpoint público.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const getByModel = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const comments = await getModelComments(
            req.params.modelId,
            { page, limit },
        );
        sendSuccess(
            res,
            "Comentarios recuperados correctamente.",
            comments,
        );
    } catch (error) {
        sendError(res, error.message + ".", 500);
    }
};

/**
 * Actualiza el contenido de un comentario existente.
 * Requiere autenticación y que el usuario sea el autor del comentario o administrador.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const update = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content || content.trim() === "") {
            return sendError(
                res,
                "El comentario no puede estar vacío.",
                400,
            );
        }

        const updated = await updateComment(
            req.params.commentId,
            req.user,
            content.trim(),
        );

        sendSuccess(
            res,
            "Comentario actualizado correctamente.",
            updated,
        );
    } catch (error) {
        const status = error.message.includes(
            "El comentario no existe",
        )
            ? 404
            : 403;
        sendError(res, error.message + ".", status);
    }
};

/**
 * Elimina un comentario específico.
 * Requiere autenticación y que el usuario sea el autor del comentario o administrador.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const remove = async (req, res) => {
    try {
        const result = await deleteComment(
            req.params.commentId,
            req.user,
        );
        sendSuccess(res, result.message);
    } catch (error) {
        const status = error.message.includes(
            "El comentario no existe",
        )
            ? 404
            : 403;
        sendError(res, error.message + ".", status);
    }
};

/**
 * Responde a un comentario existente.
 * Requiere autenticación.
 *
 * @param {import("express").Request} req - Objeto de petición de Express.
 * @param {import("express").Response} res - Objeto de respuesta de Express.
 */
const reply = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content || content.trim() === "") {
            return sendError(
                res,
                "La respuesta no puede estar vacía.",
                400,
            );
        }

        const replyData = await replyToComment(
            req.params.commentId,
            req.user.id,
            content.trim(),
        );

        sendSuccess(
            res,
            "Respuesta publicada correctamente.",
            replyData,
            201,
        );
    } catch (error) {
        const status = error.message.includes(
            "El comentario original no existe",
        )
            ? 404
            : 400;
        sendError(res, error.message + ".", status);
    }
};

export { create, getByModel, update, remove, reply };
