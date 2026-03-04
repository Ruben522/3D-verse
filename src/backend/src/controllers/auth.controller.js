import {
    registerUser,
    loginUser,
    getCurrentUser,
} from "../services/auth.service.js";
import { sendSuccess, sendError } from "../utils/helper/response.helper.js";

/**
 * Registra un nuevo usuario en la plataforma.
 */
const register = async (req, res) => {
    try {
        const data = await registerUser(req.body);
        sendSuccess(res, "Usuario registrado exitosamente", data, 201);
    } catch (error) {
        sendError(res, error.message, 400);
    }
};

/**
 * Autentica a un usuario e inicia su sesión.
 */
const login = async (req, res) => {
    try {
        const data = await loginUser(req.body);
        sendSuccess(res, "Inicio de sesión exitoso", data);
    } catch (error) {
        sendError(res, error.message, 401);
    }
};

/**
 * Obtiene los datos del usuario autenticado actualmente (para validación de sesión/token).
 */
const me = async (req, res) => {
    try {
        const user = await getCurrentUser(req.user.id);
        sendSuccess(res, "Datos del usuario recuperados", user);
    } catch (error) {
        sendError(res, error.message, 404);
    }
};

export { register, login, me };