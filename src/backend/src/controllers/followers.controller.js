import {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    checkFollow,
} from "../services/followers.service.js";
import {
    sendSuccess,
    sendError,
} from "../utils/helper/response.helper.js";

/**
 * Permite al usuario autenticado seguir a otro creador.
 */
const follow = async (req, res) => {
    try {
        const result = await followUser(
            req.params.userId,
            req.user.id,
        );
        sendSuccess(res, result.message, null);
    } catch (error) {
        sendError(res, error.message, 400);
    }
};

/**
 * Permite al usuario autenticado dejar de seguir a otro creador.
 */
const unfollow = async (req, res) => {
    try {
        const result = await unfollowUser(
            req.params.userId,
            req.user.id,
        );
        sendSuccess(res, result.message, null);
    } catch (error) {
        sendError(res, error.message, 400);
    }
};

/**
 * Obtiene la lista de seguidores de un usuario.
 */
const followers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const result = await getFollowers(
            req.params.userId,
            { page, limit },
        );
        sendSuccess(res, "Seguidores recuperados", result);
    } catch (error) {
        sendError(res, error.message, 500);
    }
};

/**
 * Obtiene la lista de usuarios a los que sigue un usuario en concreto.
 */
const following = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const result = await getFollowing(
            req.params.userId,
            { page, limit },
        );
        sendSuccess(res, "Siguiendo recuperados", result);
    } catch (error) {
        sendError(res, error.message, 500);
    }
};

/**
 * Comprueba si el usuario autenticado sigue al usuario proporcionado.
 */
const check = async (req, res) => {
    try {
        const result = await checkFollow(
            req.params.userId,
            req.user.id,
        );
        sendSuccess(res, "Comprobación exitosa", result);
    } catch (error) {
        sendError(res, error.message, 500);
    }
};

export { follow, unfollow, followers, following, check };
