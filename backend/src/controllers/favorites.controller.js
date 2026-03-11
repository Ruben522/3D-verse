import {
    addFavorite,
    removeFavorite,
    getUserFavorites,
    checkFavorite,
} from "../services/favorites.service.js";
import {
    sendSuccess,
    sendError,
} from "../utils/helper/response.helper.js";

/**
 * Añade un modelo a los favoritos del usuario autenticado.
 * Idempotente: si ya estaba marcado como favorito, devuelve mensaje informativo.
 * Requiere autenticación.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const favorite = async (req, res) => {
    try {
        const result = await addFavorite(
            req.params.id,
            req.user.id,
        );
        sendSuccess(res, result.message + ".", null);
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
 * Elimina un modelo de los favoritos del usuario autenticado.
 * Idempotente: si no estaba en favoritos, devuelve mensaje informativo.
 * Requiere autenticación.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const unfavorite = async (req, res) => {
    try {
        const result = await removeFavorite(
            req.params.id,
            req.user.id,
        );
        sendSuccess(res, result.message + ".", null);
    } catch (error) {
        sendError(res, error.message + ".", 400);
    }
};

/**
 * Obtiene la lista paginada de favoritos de un usuario específico.
 * Endpoint público (cualquiera puede ver los favoritos de otros usuarios).
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const getUserFavoritesPublic = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const result = await getUserFavorites(
            req.params.userId,
            { page, limit },
        );
        sendSuccess(
            res,
            "Favoritos del usuario recuperados correctamente.",
            result,
        );
    } catch (error) {
        sendError(res, error.message + ".", 500);
    }
};

/**
 * Obtiene la lista paginada de favoritos del usuario autenticado.
 * Requiere autenticación.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const getMyFavorites = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const result = await getUserFavorites(req.user.id, {
            page,
            limit,
        });
        sendSuccess(
            res,
            "Mis favoritos recuperados correctamente.",
            result,
        );
    } catch (error) {
        sendError(res, error.message + ".", 500);
    }
};

/**
 * Comprueba si un modelo está marcado como favorito por el usuario autenticado.
 * Requiere autenticación.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const check = async (req, res) => {
    try {
        const result = await checkFavorite(
            req.params.id,
            req.user.id,
        );
        sendSuccess(
            res,
            "Comprobación de favorito realizada correctamente.",
            result,
        );
    } catch (error) {
        sendError(res, error.message + ".", 500);
    }
};

export {
    favorite,
    unfavorite,
    getMyFavorites,
    check,
    getUserFavoritesPublic,
};
