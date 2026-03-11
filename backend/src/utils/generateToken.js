import jwt from "jsonwebtoken";

/**
 * Genera un token JWT firmado con el payload proporcionado.
 * Incluye validación básica de variables de entorno y manejo seguro de expiración.
 *
 * @param {Object} payload - Información del usuario a codificar (id, username, role, etc.)
 * @param {Object} [options] - Opciones adicionales (no recomendado sobreescribir expiresIn normalmente)
 * @param {string} [options.expiresIn] - Tiempo de expiración personalizado (ej: "1h", "30d")
 * @returns {string} Token JWT válido
 * @throws {Error} Si falta JWT_SECRET o hay error durante la generación
 */
const generateToken = (payload, options = {}) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error(
            "JWT_SECRET no está configurado en las variables de entorno.",
        );
    }

    const expiresIn =
        options.expiresIn ||
        process.env.JWT_EXPIRES ||
        "14d";

    return jwt.sign(payload, secret, { expiresIn });
};

export { generateToken };
