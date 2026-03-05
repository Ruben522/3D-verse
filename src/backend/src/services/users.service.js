import prisma from "../config/prisma.js";
import path from "path";
import fs from "fs";
import { checkPermission } from "../utils/checkPermission.js";
import {
    sendSuccess,
    sendError,
} from "../utils/helper/response.helper.js";

/**
 * Obtiene el perfil completo de un usuario, incluyendo estadísticas globales de su impacto.
 * Esta función trae absolutamente todo lo necesario para mostrar un perfil completo en el frontend:
 * datos personales, redes sociales, estadísticas agregadas y contenido reciente (modelos propios y favoritos).
 *
 * @param {string} userId - ID del usuario cuyo perfil se desea obtener
 * @returns {Promise<Object>} Objeto con tres secciones principales: profile, stats y content
 * @throws {Error} Si el usuario no existe
 */
const getUserById = async (userId) => {
    const user = await prisma.users.findUnique({
        where: { id: userId },
        include: {
            models: {
                take: 6,
                orderBy: { created_at: "desc" },
                include: {
                    _count: {
                        select: { model_likes: true },
                    },
                },
            },

            favorites: {
                take: 6,
                orderBy: { created_at: "desc" },
                include: {
                    models: {
                        include: {
                            users: {
                                select: {
                                    username: true,
                                    avatar: true,
                                },
                            },
                        },
                    },
                },
            },

            _count: {
                select: {
                    models: true,
                    favorites: true,
                    comments: true,
                    model_likes: true,
                    followers_followers_user_idTousers: true,
                    followers_followers_follower_idTousers: true,
                },
            },
        },
    });

    if (!user) throw new Error("Usuario no encontrado");

    const aggregateStats = await prisma.models.aggregate({
        where: { user_id: userId },
        _sum: { downloads: true, views: true },
    });

    const totalLikesReceived =
        await prisma.model_likes.count({
            where: { models: { user_id: userId } },
        });

    return {
        profile: {
            id: user.id,
            username: user.username,
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            avatar: user.avatar,
            bio: user.bio,
            location: user.location,
            role: user.role,
            created_at: user.created_at,
            social: {
                youtube: user.youtube,
                twitter: user.twitter,
                linkedin: user.linkedin,
                github: user.github,
            },
        },
        stats: {
            total_models: user._count.models,
            total_followers:
                user._count
                    .followers_followers_user_idTousers,
            total_following:
                user._count
                    .followers_followers_follower_idTousers,
            total_downloads:
                aggregateStats._sum.downloads || 0,
            total_views: aggregateStats._sum.views || 0,
            total_likes_received: totalLikesReceived,
            total_favorites_given: user._count.favorites,
        },
        content: {
            recent_models: user.models,
            recent_favorites: user.favorites.map(
                (f) => f.models,
            ),
        },
    };
};

/**
 * Obtiene una lista paginada de usuarios con información básica y conteo de modelos.
 * Ordenados por fecha de creación descendente (los más recientes primero).
 *
 * @param {Object} [options] - Opciones de paginación
 * @param {number} [options.page=1] - Número de página (comienza en 1)
 * @param {number} [options.limit=20] - Cantidad de usuarios por página (máximo 50)
 * @returns {Promise<Object>} Objeto con paginación y lista de usuarios
 * @property {number} page - Página actual
 * @property {number} limit - Registros por página
 * @property {number} total - Total de usuarios en la base de datos
 * @property {number} totalPages - Total de páginas disponibles
 * @property {Array<Object>} data - Lista de usuarios
 */
const getUsers = async ({ page = 1, limit = 20 }) => {
    const safeLimit = Math.min(limit, 50);
    const offset = (page - 1) * safeLimit;

    const [total, users] = await prisma.$transaction([
        prisma.users.count(),
        prisma.users.findMany({
            select: {
                id: true,
                name: true,
                lastname: true,
                username: true,
                avatar: true,
                bio: true,
                role: true,
                followers_count: true,
                following_count: true,
                created_at: true,
                _count: { select: { models: true } },
            },
            orderBy: { created_at: "desc" },
            skip: offset,
            take: safeLimit,
        }),
    ]);

    return {
        page,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
        data: users,
    };
};

/**
 * Actualiza los datos de un usuario. Solo permite modificar campos permitidos.
 * Requiere que el usuario autenticado tenga permiso para modificar el perfil.
 *
 * @param {string} userId - ID del usuario a actualizar
 * @param {Object} currentUser - Usuario autenticado que realiza la acción
 * @param {Object} data - Objeto con los campos a actualizar
 * @param {string} [data.name] - Nombre
 * @param {string} [data.lastname] - Apellido
 * @param {string} [data.username] - Nombre de usuario (único)
 * @param {string} [data.avatar] - URL del avatar
 * @param {string} [data.bio] - Biografía
 * @param {string} [data.youtube] - URL de YouTube
 * @param {string} [data.twitter] - URL de Twitter/X
 * @param {string} [data.linkedin] - URL de LinkedIn
 * @param {string} [data.github] - URL de GitHub
 * @param {string} [data.location] - Ubicación
 * @returns {Promise<Object>} Usuario actualizado con campos seleccionados
 * @throws {Error} Si no hay campos para actualizar
 * @throws {Error} Si el nombre de usuario ya está en uso (código P2002)
 * @throws {Error} Si el usuario no existe (código P2025)
 */
const updateUser = async (userId, currentUser, data) => {
    checkPermission(userId, currentUser);

    const allowedFields = [
        "name",
        "lastname",
        "username",
        "avatar",
        "bio",
        "youtube",
        "twitter",
        "linkedin",
        "github",
        "location",
    ];

    const updateData = {};
    for (const field of allowedFields) {
        if (data[field] !== undefined) {
            updateData[field] = data[field];
        }
    }

    if (Object.keys(updateData).length === 0)
        throw new Error("No hay campos para actualizar");
    updateData.updated_at = new Date();

    try {
        const updatedUser = await prisma.users.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                name: true,
                lastname: true,
                username: true,
                avatar: true,
                role: true,
                created_at: true,
                updated_at: true,
            },
        });
        return updatedUser;
    } catch (error) {
        if (error.code === "P2002")
            throw new Error(
                "Ese nombre de usuario o email ya está en uso",
            );
        if (error.code === "P2025")
            throw new Error("Usuario no encontrado");
        throw error;
    }
};

/**
 * Elimina completamente a un usuario y todos sus archivos asociados en el sistema de archivos
 * (carpetas de modelos e imágenes en /uploads).
 * Requiere permisos de administración o ser el propio usuario.
 *
 * @param {string} userId - ID del usuario a eliminar
 * @param {Object} currentUser - Usuario autenticado que realiza la acción
 * @returns {Promise<Object>} Mensaje de confirmación
 * @throws {Error} Si el usuario no existe
 */
const deleteUser = async (userId, currentUser) => {
    checkPermission(userId, currentUser);

    const user = await prisma.users.findUnique({
        where: { id: userId },
    });
    if (!user) throw new Error("Usuario no encontrado");

    await prisma.users.delete({ where: { id: userId } });

    const folders = [
        path.join(
            process.cwd(),
            "uploads",
            "models",
            userId,
        ),
        path.join(
            process.cwd(),
            "uploads",
            "images",
            userId,
        ),
    ];

    folders.forEach((folder) => {
        if (fs.existsSync(folder)) {
            fs.rmSync(folder, {
                recursive: true,
                force: true,
            });
        }
    });

    return {
        message:
            "Usuario y todos sus archivos eliminados correctamente",
    };
};

/**
 * Obtiene la lista completa de modelos que el usuario ha marcado como favoritos.
 * Devuelve solo la información relevante de cada modelo.
 *
 * @param {string} userId - ID del usuario cuyos favoritos se desean obtener
 * @returns {Promise<Array<Object>>} Array de modelos favoritos
 */
const getUserFavorites = async (userId) => {
    const favorites = await prisma.favorites.findMany({
        where: { user_id: userId },
        include: {
            models: {
                select: {
                    id: true,
                    title: true,
                    main_image_url: true,
                    downloads: true,
                    views: true,
                    created_at: true,
                },
            },
        },
        orderBy: { created_at: "desc" },
    });

    return favorites.map((fav) => fav.models);
};

export {
    getUserFavorites,
    getUsers,
    updateUser,
    deleteUser,
    getUserById,
};
