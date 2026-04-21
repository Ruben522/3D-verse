import {
    getUserFavorites,
    getUserLikes,
    getUsers,
    updateUser,
    deleteUser,
    getUserById,
    getPublicUsers,
    getUserByUsername,
} from "../services/users.service.js";
import { sendSuccess, sendError } from "../utils/helper/response.helper.js";

/**
 * Obtiene los modelos que un usuario ha marcado como "me gusta" (likes dados).
 * Requiere autenticación (solo el propio usuario o admin puede ver sus likes).
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const getLikes = async (req, res) => {
    try {
        const { userId } = req.params;

        // Opcional: solo permitir ver likes propios o si es admin
        if (req.user.id !== userId && req.user.role !== "admin") {
            return sendError(
                res,
                "No tienes permiso para ver los likes de este usuario.",
                403,
            );
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const likes = await getUserLikes(userId, {
            page,
            limit,
        });
        sendSuccess(res, "Likes del usuario recuperados correctamente.", likes);
    } catch (error) {
        sendError(res, error.message, 400);
    }
};

/**
 * Obtiene la lista de modelos marcados como favoritos por un usuario.
 * No requiere autenticación (público).
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const getFavorites = async (req, res) => {
    try {
        const favorites = await getUserFavorites(req.params.id);
        sendSuccess(res, "Favoritos recuperados", favorites);
    } catch (error) {
        sendError(res, error.message, 400);
    }
};

/**
 * Obtiene una lista paginada de todos los usuarios de la plataforma.
 * Endpoint público (útil para búsqueda de creadores, rankings, etc.).
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const getAll = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const users = await getUsers({ page, limit });
        sendSuccess(res, "Lista de usuarios recuperada", users);
    } catch (error) {
        sendError(res, error.message, 500);
    }
};

/**
 * Actualiza los datos públicos del perfil del usuario.
 * Requiere autenticación y que el usuario sea el propietario o admin.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const update = async (req, res) => {
    try {
        if (!req.user) {
            return sendError(res, "No autenticado", 401);
        }

        const user = await updateUser(req.params.id, req.user, req.body);
        sendSuccess(res, "Perfil actualizado correctamente", user);
    } catch (error) {
        sendError(res, error.message, 400);
    }
};

/**
 * Elimina completamente un usuario y todos sus archivos asociados.
 * Requiere autenticación y que el usuario sea el propietario o admin.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const remove = async (req, res) => {
    try {
        if (!req.user) {
            return sendError(res, "No autenticado", 401);
        }

        const result = await deleteUser(req.params.id, req.user);
        sendSuccess(res, result.message);
    } catch (error) {
        sendError(res, error.message, 403);
    }
};

/**
 * Obtiene lista pública de usuarios (tarjetas para página "Desarrolladores").
 * Solo campos seguros y visibles.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const getAllPublicUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const users = await getPublicUsers({ page, limit });
        sendSuccess(res, "Lista de creadores recuperada.", users);
    } catch (error) {
        sendError(res, error.message, 500);
    }
};

/**
 * Obtiene el perfil completo de un usuario por su username.
 * Endpoint público.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const getByUsername = async (req, res) => {
    try {
        const user = await getUserByUsername(req.params.username);
        sendSuccess(res, "Perfil de usuario recuperado.", user);
    } catch (error) {
        sendError(res, error.message, 404);
    }
};

/**
 * Obtiene el perfil completo público de un usuario por ID.
 * Cualquiera puede verlo (sin email ni datos privados).
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const getById = async (req, res) => {
    try {
        const user = await getUserById(req.params.id);
        sendSuccess(res, "Perfil de usuario recuperado.", user);
    } catch (error) {
        sendError(res, error.message, 404);
    }
};

export {
    getFavorites,
    getAll,
    update,
    remove,
    getById,
    getAllPublicUsers,
    getLikes,
    getByUsername,
};
