import jwt from "jsonwebtoken";

/**
 * Middleware obligatorio: verifica que exista un token Bearer válido.
 * Si es válido, adjunta el payload decodificado en `req.user`.
 * Si falla, responde con 401 o 403 y detiene la cadena.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({
                error: "Token requerido o formato inválido",
            });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET,
        );
        req.user = decoded;
        next();
    } catch (error) {
        return res
            .status(403)
            .json({ error: "Token inválido o expirado" });
    }
};

/**
 * Middleware opcional: intenta verificar el token Bearer si existe.
 * Adjunta `req.user` (objeto decodificado o `null` si no hay token o es inválido).
 * Nunca falla la petición, siempre llama a `next()`.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const optionalToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        req.user = null;
        return next();
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(
        token,
        process.env.JWT_SECRET,
        (err, decoded) => {
            req.user = err ? null : decoded;
            next();
        },
    );
};

/**
 * Middleware de autorización: requiere que el usuario esté autenticado
 * y tenga rol "admin".
 * Responde 403 si no es administrador.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res
            .status(403)
            .json({
                error: "Acceso denegado: se requieren privilegios de administrador",
            });
    }
    next();
};

/**
 * Middleware de autorización: permite el acceso solo si el usuario autenticado
 * es el propietario del recurso (por ID en params) o es administrador.
 * Usa `req.params.id` como ID del recurso a proteger.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const isOwnerOrAdmin = (req, res, next) => {
    if (!req.user) {
        return res
            .status(401)
            .json({ error: "No autenticado" });
    }

    const userIdFromToken = req.user.id;
    const resourceIdFromParams =
        req.params.id || req.params.userId; // más flexible
    const userRole = req.user.role;

    if (
        userIdFromToken === resourceIdFromParams ||
        userRole === "admin"
    ) {
        return next();
    }

    return res
        .status(403)
        .json({
            error: "No tienes permiso para gestionar este recurso",
        });
};

export {
    verifyToken,
    optionalToken,
    isAdmin,
    isOwnerOrAdmin,
};
