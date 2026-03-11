import prisma from "../config/prisma.js";

/**
 * Añade un modelo a la lista de favoritos de un usuario.
 * @param {string} modelId - ID del modelo.
 * @param {string} userId - ID del usuario.
 */
const addFavorite = async (modelId, userId) => {
    const model = await prisma.models.findUnique({
        where: { id: modelId },
    });
    if (!model)
        throw new Error("El modelo solicitado no existe");

    try {
        await prisma.favorites.create({
            data: { user_id: userId, model_id: modelId },
        });
        return { message: "Añadido a favoritos" };
    } catch (error) {
        if (error.code === "P2002")
            return { message: "Ya estaba en favoritos" };
        throw error;
    }
};

/**
 * Elimina un modelo de la lista de favoritos de un usuario.
 * @param {string} modelId - ID del modelo.
 * @param {string} userId - ID del usuario.
 */
const removeFavorite = async (modelId, userId) => {
    try {
        await prisma.favorites.delete({
            where: {
                user_id_model_id: {
                    user_id: userId,
                    model_id: modelId,
                },
            },
        });
        return { message: "Eliminado de favoritos" };
    } catch (error) {
        if (error.code === "P2025")
            return { message: "No estaba en favoritos" };
        throw error;
    }
};

/**
 * Obtiene la lista paginada de modelos favoritos de un usuario.
 * @param {string} userId - ID del usuario del que se quieren ver los favoritos.
 * @param {Object} pagination - Opciones de paginación { page, limit }.
 */
const getUserFavorites = async (
    userId,
    { page = 1, limit = 20 },
) => {
    const safeLimit = Math.min(limit, 50);
    const offset = (page - 1) * safeLimit;

    const [total, favoritesList] =
        await prisma.$transaction([
            prisma.favorites.count({
                where: { user_id: userId },
            }),
            prisma.favorites.findMany({
                where: { user_id: userId },
                select: {
                    models: {
                        select: {
                            id: true,
                            title: true,
                            main_color: true,
                            description: true,
                            main_image_url: true,
                            downloads: true,
                            views: true,
                            created_at: true,
                            users: {
                                select: {
                                    id: true,
                                    username: true,
                                    avatar: true,
                                },
                            },
                        },
                    },
                },
                orderBy: { created_at: "desc" },
                skip: offset,
                take: safeLimit,
            }),
        ]);

    const formattedData = favoritesList.map((fav) => ({
        id: fav.models.id,
        title: fav.models.title,
        main_color: fav.models.main_color,
        description: fav.models.description,
        main_image_url: fav.models.main_image_url,
        downloads: fav.models.downloads,
        views: fav.models.views,
        created_at: fav.models.created_at,
        creator: fav.models.users,
    }));

    return {
        page,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
        data: formattedData,
    };
};

/**
 * Verifica si un usuario tiene un modelo en sus favoritos.
 * @param {string} modelId - ID del modelo.
 * @param {string} userId - ID del usuario.
 */
const checkFavorite = async (modelId, userId) => {
    const exists = await prisma.favorites.findUnique({
        where: {
            user_id_model_id: {
                user_id: userId,
                model_id: modelId,
            },
        },
    });
    return { isFavorite: !!exists };
};

export {
    addFavorite,
    removeFavorite,
    getUserFavorites,
    checkFavorite,
};
