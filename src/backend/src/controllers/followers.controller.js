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
 * Permite al usuario autenticado seguir a otro usuario.
 * Idempotente: si ya se seguía, devuelve mensaje informativo.
 * Requiere autenticación.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const follow = async (req, res) => {
    try {
        const result = await followUser(
            req.params.userId,
            req.user.id,
        );
        sendSuccess(res, result.message + ".", null);
    } catch (error) {
        sendError(res, error.message + ".", 400);
    }
};

/**
 * Permite al usuario autenticado dejar de seguir a otro usuario.
 * Idempotente: si no se seguía, devuelve mensaje informativo.
 * Requiere autenticación.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const unfollow = async (req, res) => {
    try {
        const result = await unfollowUser(
            req.params.userId,
            req.user.id,
        );
        sendSuccess(res, result.message + ".", null);
    } catch (error) {
        sendError(res, error.message + ".", 400);
    }
};

/**
 * Obtiene la lista paginada de seguidores de un usuario específico.
 * Endpoint público.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const followers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const result = await getFollowers(
            req.params.userId,
            { page, limit },
        );
        sendSuccess(
            res,
            "Seguidores recuperados correctamente.",
            result,
        );
    } catch (error) {
        sendError(res, error.message + ".", 500);
    }
};

/**
 * Obtiene la lista paginada de usuarios a los que sigue un usuario específico.
 * Endpoint público.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const following = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const result = await getFollowing(
            req.params.userId,
            { page, limit },
        );
        sendSuccess(
            res,
            "Siguiendo recuperados correctamente.",
            result,
        );
    } catch (error) {
        sendError(res, error.message + ".", 500);
    }
};

/**
 * Comprueba si el usuario autenticado sigue al usuario indicado.
 * Requiere autenticación.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const check = async (req, res) => {
    try {
        const result = await checkFollow(
            req.params.userId,
            req.user.id,
        );
        sendSuccess(
            res,
            "Comprobación realizada correctamente.",
            result,
        );
    } catch (error) {
        sendError(res, error.message + ".", 500);
    }
};

export { follow, unfollow, followers, following, check };
