import prisma from "../config/prisma.js";
import path from "path";
import fs from "fs";
import { checkPermission } from "../utils/checkPermission.js";

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
            profile: true,
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
                                    profile: {
                                        select: {
                                            username: true,
                                            avatar: true,
                                        },
                                    },
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

    if (!user) throw new Error("Usuario no encontrado.");

    const aggregateStats = await prisma.models.aggregate({
        where: { user_id: userId },
        _sum: { downloads: true, views: true },
    });

    const totalLikesReceived = await prisma.model_likes.count({
        where: { models: { user_id: userId } },
    });

    const p = user.profile || {};

    return {
        profile: {
            id: user.id,
            username: p.username,
            name: p.name,
            lastname: p.lastname,
            avatar: p.avatar,
            bio: p.bio,
            location: p.location,
            created_at: user.created_at,
            social: {
                youtube: p.youtube,
                twitter: p.twitter,
                linkedin: p.linkedin,
                github: p.github,
            },
            customization: {
                banner_url: p.banner_url,
                card_bg_color: p.card_bg_color,
                page_bg_url: p.page_bg_url,
                badge_url: p.badge_url,
                primary_color: p.primary_color,
            },
        },
        stats: {
            total_models: user._count.models,
            total_followers: p.followers_count || 0,
            total_following: p.following_count || 0,
            total_downloads: aggregateStats._sum.downloads || 0,
            total_views: aggregateStats._sum.views || 0,
            total_likes_received: totalLikesReceived,
            total_favorites_given: user._count.favorites,
        },
        content: {
            recent_models: user.models,
            recent_favorites: user.favorites.map((f) => f.models),
        },
    };
};

/**
 * Obtiene el perfil completo de un usuario por su username (público).
 * Útil para URLs amigables como /u/ruben_dev
 *
 * @param {string} username - Nombre de usuario único
 * @returns {Promise<Object>} Perfil completo (mismo formato que getUserById)
 * @throws {Error} Si el usuario no existe
 */
const getUserByUsername = async (username) => {
    const user = await prisma.users.findFirst({
        where: {
            profile: {
                username: username.trim(),
            },
        },
        include: {
            profile: true,
            models: {
                take: 6,
                orderBy: { created_at: "desc" },
                include: {
                    _count: { select: { model_likes: true } },
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
                                    profile: {
                                        select: {
                                            username: true,
                                            avatar: true,
                                        },
                                    },
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

    if (!user) throw new Error("Usuario no encontrado.");

    const aggregateStats = await prisma.models.aggregate({
        where: { user_id: user.id },
        _sum: { downloads: true, views: true },
    });

    const totalLikesReceived = await prisma.model_likes.count({
        where: { models: { user_id: user.id } },
    });

    const p = user.profile || {};

    return {
        profile: {
            id: user.id,
            username: p.username,
            name: p.name,
            lastname: p.lastname,
            avatar: p.avatar,
            bio: p.bio,
            location: p.location,
            created_at: user.created_at,
            social: {
                youtube: p.youtube,
                twitter: p.twitter,
                linkedin: p.linkedin,
                github: p.github,
            },
            customization: {
                banner_url: p.banner_url,
                card_bg_color: p.card_bg_color,
                page_bg_url: p.page_bg_url,
                badge_url: p.badge_url,
                primary_color: p.primary_color,
            },
        },
        stats: {
            total_models: user._count.models,
            total_followers: p.followers_count || 0,
            total_following: p.following_count || 0,
            total_downloads: aggregateStats._sum.downloads || 0,
            total_views: aggregateStats._sum.views || 0,
            total_likes_received: totalLikesReceived,
            total_favorites_given: user._count.favorites,
        },
        content: {
            recent_models: user.models,
            recent_favorites: user.favorites.map((f) => f.models),
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
                email: true,
                role: true,
                created_at: true,
                profile: {
                    select: {
                        username: true,
                        name: true,
                        lastname: true,
                        avatar: true,
                        bio: true,
                        followers_count: true,
                        following_count: true,
                    },
                },
                _count: { select: { models: true } },
            },
            orderBy: { created_at: "desc" },
            skip: offset,
            take: safeLimit,
        }),
    ]);

    const flattened = users.map((u) => ({
        id: u.id,
        email: u.email,
        role: u.role,
        created_at: u.created_at,
        models_count: u._count.models,
        ...u.profile,
    }));

    return {
        page,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
        data: flattened,
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
const getPublicUsers = async ({ page = 1, limit = 20 }) => {
    const safeLimit = Math.min(limit, 50);
    const offset = (page - 1) * safeLimit;

    const [total, users] = await prisma.$transaction([
        prisma.users.count(),
        prisma.users.findMany({
            select: {
                id: true,
                profile: {
                    select: {
                        username: true,
                        avatar: true,
                        bio: true,
                        followers_count: true,
                        banner_url: true,
                        card_bg_color: true,
                        badge_url: true,
                        primary_color: true,
                    },
                },
                _count: { select: { models: true } },
            },
            orderBy: { created_at: "desc" },
            skip: offset,
            take: safeLimit,
        }),
    ]);

    const flattened = users.map((u) => ({
        id: u.id,
        models_count: u._count.models,
        ...u.profile,
    }));

    return {
        page,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
        data: flattened,
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

    const userFields = ["username"]; // Solo username se puede cambiar en users si lo necesitas
    const profileFields = [
        "name",
        "lastname",
        "avatar",
        "bio",
        "location",
        "youtube",
        "twitter",
        "linkedin",
        "github",
        "banner_url",
        "card_bg_color",
        "page_bg_url",
        "badge_url",
        "primary_color",
    ];

    const userUpdate = {};
    const profileUpdate = {};

    for (const field in data) {
        if (userFields.includes(field)) {
            userUpdate[field] = data[field];
        } else if (profileFields.includes(field)) {
            profileUpdate[field] = data[field];
        }
    }

    if (
        Object.keys(userUpdate).length === 0 &&
        Object.keys(profileUpdate).length === 0
    ) {
        throw new Error("No hay campos para actualizar.");
    }

    userUpdate.updated_at = new Date();
    profileUpdate.updated_at = new Date();

    try {
        const updated = await prisma.users.update({
            where: { id: userId },
            data: {
                ...userUpdate,
                profile: { update: profileUpdate },
            },
            include: { profile: true },
        });
        
        const completeUpdated = await getUserById(userId);
        await syncUserToMeili(completeUpdated);

        return {
            id: updated.id,
            username: updated.username || updated.profile.username,
            role: updated.role,
            ...updated.profile,
        };
    } catch (error) {
        if (error.code === "P2002") {
            throw new Error("Ese nombre de usuario ya está en uso.");
        }
        if (error.code === "P2025") {
            throw new Error("Usuario no encontrado.");
        }
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
    if (!user) throw new Error("Usuario no encontrado.");

    await prisma.users.delete({ where: { id: userId } });

    const folders = [
        path.join(process.cwd(), "uploads", "models", userId),
        path.join(process.cwd(), "uploads", "images", userId),
        path.join(process.cwd(), "uploads", "profiles", userId), // ← para banners, badges, etc.
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
        message: "Usuario, perfil y archivos eliminados correctamente.",
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

/**
 * Obtiene los modelos que un usuario ha marcado como "me gusta" (likes dados).
 * Paginado y ordenado por fecha de like descendente.
 *
 * @param {string} userId - ID del usuario
 * @param {Object} [options] - Opciones de paginación
 * @param {number} [options.page=1]
 * @param {number} [options.limit=20]
 * @returns {Promise<Object>} Objeto paginado con modelos liked
 */
const getUserLikes = async (userId, { page = 1, limit = 20 } = {}) => {
    const safeLimit = Math.min(limit, 50);
    const offset = (page - 1) * safeLimit;

    const [total, likes] = await prisma.$transaction([
        prisma.model_likes.count({
            where: { user_id: userId },
        }),
        prisma.model_likes.findMany({
            where: { user_id: userId },
            select: {
                created_at: true,
                models: {
                    select: {
                        id: true,
                        title: true,
                        main_image_url: true,
                        downloads: true,
                        views: true,
                        created_at: true,
                        _count: {
                            select: { model_likes: true },
                        },
                    },
                },
            },
            orderBy: { created_at: "desc" },
            skip: offset,
            take: safeLimit,
        }),
    ]);

    const flattened = likes.map((like) => ({
        liked_at: like.created_at,
        ...like.models,
    }));

    return {
        page,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
        data: flattened,
    };
};

export {
    getUserFavorites,
    getUsers,
    updateUser,
    deleteUser,
    getUserById,
    getPublicUsers,
    getUserLikes,
    getUserByUsername,
};
