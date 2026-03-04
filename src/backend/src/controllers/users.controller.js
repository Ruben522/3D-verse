import {
  getUserFavorites,
  getUsers,
  updateUser,
  deleteUser,
  getUserById,
} from "../services/users.service.js";
import { sendSuccess, sendError } from "../utils/helper/response.helper.js";

/**
 * Obtiene la lista completa de modelos que un usuario ha marcado como favoritos.
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
 * Actualiza la información pública del perfil de un usuario.
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
 * Elimina por completo un usuario y todos sus archivos asociados.
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
 * Obtiene el perfil completo de un usuario por su ID, junto con sus estadísticas.
 */
const getById = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    sendSuccess(res, "Perfil de usuario recuperado", user);
  } catch (error) {
    sendError(res, error.message, 404);
  }
};

export { getFavorites, getAll, update, remove, getById };