import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res
            .status(401)
            .json({ error: "Token requerido" });
    }

    if (!authHeader.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({ error: "Formato de token inválido" });
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

const optionalToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        req.user = null;
        return next();
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            req.user = null;
        } else {
            req.user = user;
        }
        next();
    });
};

const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res
            .status(403)
            .json({ error: "Acceso denegado: se requieren privilegios de administrador" });
    }
    next();
};

const isOwnerOrAdmin = (req, res, next) => {
    const userIdFromToken = req.user.id;
    const userIdFromParams = req.params.id;
    const userRole = req.user.role;

    if (userIdFromToken === userIdFromParams || userRole === 'admin') {
        return next();
    }

    return res.status(403).json({ error: "No tienes permiso para gestionar este perfil" });
};

export { verifyToken, optionalToken, isAdmin, isOwnerOrAdmin };
