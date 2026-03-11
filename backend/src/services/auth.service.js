import prisma from "../config/prisma.js";
import { hashPassword, comparePassword } from "../utils/hashPassword.js";
import { generateToken } from "../utils/generateToken.js";
import { validateUserFields } from "../utils/validateUserFields.js";

/**
 * Registra un nuevo usuario y crea su perfil asociado con username.
 * @param {Object} userData - Datos del usuario
 * @returns {Promise<Object>} Usuario + token JWT
 */
const registerUser = async ({
    name,
    lastname,
    username,
    email,
    password,
}) => {
    validateUserFields({ name, username, email, password });

    const hashed = await hashPassword(password);

    try {
        const user = await prisma.users.create({
            data: {
                email: email.trim(),
                password_hash: hashed,
                profile: {
                    create: {
                        username: username.trim(),
                        name: name.trim(),
                        lastname: lastname?.trim() || null,
                        avatar: null,
                        bio: null,
                        location: null,
                        youtube: null,
                        twitter: null,
                        linkedin: null,
                        github: null,
                        banner_url: null,
                        card_bg_color: "#ffffff",
                        page_bg_url: null,
                        badge_url: null,
                        primary_color: "#3b82f6",
                        followers_count: 0,
                        following_count: 0
                    }
                }
            },
            select: {
                id: true,
                email: true,
                role: true,
                profile: {
                    select: {
                        username: true,
                        name: true,
                        lastname: true,
                        avatar: true,
                        bio: true,
                        location: true,
                        banner_url: true,
                        card_bg_color: true,
                        primary_color: true
                    }
                }
            }
        });

        const token = generateToken({
            id: user.id,
            role: user.role
        });

        // Aplanamos para mantener compatibilidad con frontend
        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                ...user.profile
            },
            token
        };
    } catch (error) {
        if (error.code === "P2002") {
            throw new Error("El nombre de usuario o el email ya están en uso.");
        }
        throw error;
    }
};

/**
 * Autentica a un usuario verificando sus credenciales.
 */
const loginUser = async ({ email, password }) => {
    const user = await prisma.users.findUnique({
        where: { email },
        include: {
            profile: {
                select: {
                    username: true,
                    name: true,
                    lastname: true,
                    avatar: true,
                    bio: true,
                    location: true,
                    banner_url: true,
                    card_bg_color: true,
                    page_bg_url: true,
                    badge_url: true,
                    primary_color: true
                }
            }
        }
    });

    if (!user || !(await comparePassword(password, user.password_hash))) {
        throw new Error("Credenciales inválidas.");
    }

    const token = generateToken({
        id: user.id,
        role: user.role
    });

    return {
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            ...user.profile
        },
        token
    };
};

/**
 * Obtiene los datos del usuario autenticado actualmente.
 */
const getCurrentUser = async (userId) => {
    const user = await prisma.users.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            role: true,
            created_at: true,
            profile: true
        }
    });

    if (!user) throw new Error("Usuario no encontrado.");

    return {
        id: user.id,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        ...user.profile
    };
};

export { registerUser, loginUser, getCurrentUser };