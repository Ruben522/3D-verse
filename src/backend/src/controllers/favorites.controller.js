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
 */
const favorite = async (req, res) => {
    try {
        const result = await addFavorite(
            req.params.id,
            req.user.id,
        );
        sendSuccess(res, result.message);
    } catch (error) {
        const status =
            error.message ===
            "El modelo solicitado no existe"
                ? 404
                : 400;
        sendError(res, error.message, status);
    }
};

/**
 * Elimina un modelo de los favoritos del usuario autenticado.
 */
const unfavorite = async (req, res) => {
    try {
        const result = await removeFavorite(
            req.params.id,
            req.user.id,
        );
        sendSuccess(res, result.message);
    } catch (error) {
        sendError(res, error.message, 400);
    }
};

/**
 * Obtiene los favoritos de un usuario de forma pública.
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
            "Favoritos del usuario recuperados",
            result,
        );
    } catch (error) {
        sendError(res, error.message, 500);
    }
};

/**
 * Obtiene los favoritos del propio usuario autenticado.
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
            "Mis favoritos recuperados",
            result,
        );
    } catch (error) {
        sendError(res, error.message, 500);
    }
};

/**
 * Comprueba si un modelo está en los favoritos del usuario autenticado.
 */
const check = async (req, res) => {
    try {
        const result = await checkFavorite(
            req.params.id,
            req.user.id,
        );
        sendSuccess(
            res,
            "Comprobación de favorito exitosa",
            result,
        );
    } catch (error) {
        sendError(res, error.message, 500);
    }
};

export {
    favorite,
    unfavorite,
    getMyFavorites,
    check,
    getUserFavoritesPublic,
};
