import {
    createComment,
    getModelComments,
    updateComment,
    deleteComment,
} from "../services/comments.service.js";
import {
    sendSuccess,
    sendError,
} from "../utils/helper/response.helper.js";

/**
 * Crea un nuevo comentario en un modelo.
 */
const create = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content || content.trim() === "") {
            return sendError(
                res,
                "El comentario no puede estar vacío",
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
            "Comentario publicado",
            comment,
            201,
        );
    } catch (error) {
        if (
            error.message ===
            "El modelo solicitado no existe"
        ) {
            return sendError(res, error.message, 404);
        }
        sendError(res, error.message, 400);
    }
};

/**
 * Obtiene los comentarios de un modelo de forma paginada.
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
            "Comentarios recuperados",
            comments,
        );
    } catch (error) {
        sendError(res, error.message, 500);
    }
};

/**
 * Actualiza el texto de un comentario existente.
 */
const update = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content || content.trim() === "") {
            return sendError(
                res,
                "El comentario no puede estar vacío",
                400,
            );
        }

        const updated = await updateComment(
            req.params.commentId,
            req.user,
            content.trim(),
        );

        sendSuccess(res, "Comentario actualizado", updated);
    } catch (error) {
        if (error.message === "El comentario no existe") {
            return sendError(res, error.message, 404);
        }
        sendError(res, error.message, 403);
    }
};

/**
 * Elimina un comentario.
 */
const remove = async (req, res) => {
    try {
        const result = await deleteComment(
            req.params.commentId,
            req.user,
        );

        sendSuccess(res, result.message);
    } catch (error) {
        if (error.message === "El comentario no existe") {
            return sendError(res, error.message, 404);
        }
        sendError(res, error.message, 403);
    }
};

export { create, getByModel, update, remove };
