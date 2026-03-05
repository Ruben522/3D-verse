import prisma from "../config/prisma.js";
import {
    hashPassword,
    comparePassword,
} from "../utils/hashPassword.js";
import { generateToken } from "../utils/generateToken.js";

/**
 * Registra un nuevo usuario en la plataforma.
 * @param {Object} userData - Datos del usuario (name, lastname, username, email, password).
 * @returns {Promise<Object>} Objeto con los datos públicos del usuario y su token JWT.
 */
const registerUser = async ({
    name,
    lastname,
    username,
    email,
    password,
}) => {
    const hashed = await hashPassword(password);

    try {
        const user = await prisma.users.create({
            data: {
                name,
                lastname,
                username,
                email,
                password_hash: hashed,
            },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
            },
        });

        const token = generateToken({
            id: user.id,
            role: user.role,
        });

        return { user, token };
    } catch (error) {
        if (error.code === "P2002") {
            throw new Error(
                "El nombre de usuario o el email ya están en uso",
            );
        }
        throw error;
    }
};

/**
 * Autentica a un usuario verificando sus credenciales.
 * @param {Object} credentials - Email y contraseña del usuario.
 * @returns {Promise<Object>} Objeto con los datos públicos del usuario y su token JWT.
 */
const loginUser = async ({ email, password }) => {
    const user = await prisma.users.findUnique({
        where: { email },
    });

    if (!user) {
        throw new Error("Credenciales inválidas");
    }

    const validPassword = await comparePassword(
        password,
        user.password_hash,
    );

    if (!validPassword) {
        throw new Error("Credenciales inválidas");
    }

    const token = generateToken({
        id: user.id,
        role: user.role,
    });

    return {
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        },
        token,
    };
};

/**
 * Obtiene los datos básicos del usuario actualmente autenticado (usado para validar sesiones).
 * @param {string} userId - ID del usuario extraído del token.
 * @returns {Promise<Object>} Datos del usuario (excluyendo datos sensibles).
 */
const getCurrentUser = async (userId) => {
    const user = await prisma.users.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            lastname: true,
            username: true,
            email: true,
            role: true,
            avatar: true,
            created_at: true,
        },
    });

    if (!user) {
        throw new Error("Usuario no encontrado");
    }

    return user;
};

export { registerUser, loginUser, getCurrentUser };
