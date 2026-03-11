import {
    registerUser,
    loginUser,
    getCurrentUser,
} from "../services/auth.service.js";
import {
    sendSuccess,
    sendError,
} from "../utils/helper/response.helper.js";

/**
 * Registra un nuevo usuario en la plataforma.
 * Crea cuenta y devuelve datos básicos + token JWT.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const register = async (req, res) => {
    try {
        const data = await registerUser(req.body);
        sendSuccess(
            res,
            "Usuario registrado exitosamente.",
            data,
            201,
        );
    } catch (error) {
        sendError(res, error.message + ".", 400);
    }
};

/**
 * Autentica a un usuario e inicia sesión.
 * Devuelve token JWT y datos básicos del usuario si las credenciales son válidas.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const login = async (req, res) => {
    try {
        const data = await loginUser(req.body);
        sendSuccess(res, "Inicio de sesión exitoso.", data);
    } catch (error) {
        sendError(res, error.message + ".", 401);
    }
};

/**
 * Obtiene los datos completos del usuario autenticado actualmente.
 * Útil para validar sesión activa y obtener información del perfil propio.
 * Requiere token válido en Authorization header.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const me = async (req, res) => {
    try {
        const user = await getCurrentUser(req.user.id);
        sendSuccess(
            res,
            "Datos del usuario recuperados correctamente.",
            user,
        );
    } catch (error) {
        sendError(res, error.message + ".", 404);
    }
};

export { register, login, me };
