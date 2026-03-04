import prisma from "../config/prisma.js";
import path from "path";
import fs from "fs";
import { checkPermission } from "../utils/checkPermission.js";
import { sendSuccess, sendError } from "../utils/helper/response.helper.js"

/**
 * Obtiene el perfil completo de un usuario, incluyendo estadísticas globales de su impacto.
 * Esta función "se trae absolutamente todo" lo necesario para un perfil en el frontend.
 */

const getUserById = async (userId) => {
    const user = await prisma.users.findUnique({
        where: { id: userId },
        include: {

            models: {
                take: 6,
                orderBy: { created_at: 'desc' },
                include: {
                    _count: { select: { model_likes: true } }
                }
            },

            favorites: {
                take: 6,
                orderBy: { created_at: 'desc' },
                include: {
                    models: {
                        include: {
                            users: { select: { username: true, avatar: true } }
                        }
                    }
                }
            },

            _count: {
                select: {
                    models: true,
                    favorites: true,
                    comments: true,
                    model_likes: true,
                    followers_followers_user_idTousers: true,
                    followers_followers_follower_idTousers: true
                }
            }
        }
    });

    if (!user) throw new Error("Usuario no encontrado");

    const aggregateStats = await prisma.models.aggregate({
        where: { user_id: userId },
        _sum: {
            downloads: true,
            views: true
        }
    });

    const totalLikesReceived = await prisma.model_likes.count({
        where: { models: { user_id: userId } }
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
                github: user.github
            }
        },
        stats: {
            total_models: user._count.models,
            total_followers: user._count.followers_followers_user_idTousers,
            total_following: user._count.followers_followers_follower_idTousers,
            total_downloads: aggregateStats._sum.downloads || 0,
            total_views: aggregateStats._sum.views || 0,
            total_likes_received: totalLikesReceived,
            total_favorites_given: user._count.favorites
        },
        content: {
            recent_models: user.models,
            recent_favorites: user.favorites.map(f => f.models)
        }
    };
};

/**
 * Obtiene la lista de usuarios paginada.
 */
const getUsers = async ({ page = 1, limit = 20 }) => {
    const safeLimit = Math.min(limit, 50);
    const offset = (page - 1) * safeLimit;

    const [total, users] = await prisma.$transaction([
        prisma.users.count(),
        prisma.users.findMany({
            select: {
                id: true, name: true, lastname: true, username: true, avatar: true,
                bio: true, role: true, followers_count: true, following_count: true, created_at: true,
                _count: { select: { models: true } }
            },
            orderBy: { created_at: 'desc' },
            skip: offset,
            take: safeLimit
        })
    ]);

    return {
        page, limit: safeLimit, total, totalPages: Math.ceil(total / safeLimit), data: users
    };
};

/**
 * Actualiza la información del perfil del usuario.
 */
const updateUser = async (userId, currentUser, data) => {
    checkPermission(userId, currentUser);

    const allowedFields = [
        "name", "lastname", "username", "avatar", "bio", 
        "youtube", "twitter", "linkedin", "github", "location"
    ];

    const updateData = {};
    for (const field of allowedFields) {
        if (data[field] !== undefined) {
            updateData[field] = data[field];
        }
    }

    if (Object.keys(updateData).length === 0) throw new Error("No hay campos para actualizar");
    updateData.updated_at = new Date();

    try {
        const updatedUser = await prisma.users.update({
            where: { id: userId },
            data: updateData,
            select: { 
                id: true, name: true, lastname: true, username: true, 
                avatar: true, role: true, created_at: true, updated_at: true 
            }
        });
        return updatedUser;
    } catch (error) {
        if (error.code === 'P2002') throw new Error("Ese nombre de usuario o email ya está en uso");
        if (error.code === 'P2025') throw new Error("Usuario no encontrado");
        throw error;
    }
};

/**
 * Elimina un usuario de la BD y borra por completo sus carpetas físicas.
 */
const deleteUser = async (userId, currentUser) => {
    checkPermission(userId, currentUser);

    const user = await prisma.users.findUnique({ where: { id: userId } });
    if (!user) throw new Error("Usuario no encontrado");

    await prisma.users.delete({ where: { id: userId } });

    const folders = [
        path.join(process.cwd(), "uploads", "models", userId),
        path.join(process.cwd(), "uploads", "images", userId)
    ];

    folders.forEach(folder => {
        if (fs.existsSync(folder)) {
            fs.rmSync(folder, { recursive: true, force: true });
        }
    });

    return { message: "Usuario y todos sus archivos eliminados correctamente" };
};

/**
 * Obtiene los modelos que el usuario ha marcado como favoritos.
 */
const getUserFavorites = async (userId) => {
    const favorites = await prisma.favorites.findMany({
        where: { user_id: userId },
        include: {
            models: {
                select: { 
                    id: true, title: true, main_image_url: true, 
                    downloads: true, views: true, created_at: true 
                }
            }
        },
        orderBy: { created_at: 'desc' }
    });

    return favorites.map(fav => fav.models);
};

export { getUserFavorites, getUsers, updateUser, deleteUser, getUserById };