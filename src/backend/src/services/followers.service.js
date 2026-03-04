import prisma from "../config/prisma.js";

/**
 * Permite a un usuario seguir a otro y actualiza los contadores.
 * @param {string} userIdToFollow - ID del usuario al que se quiere seguir.
 * @param {string} followerId - ID del usuario que ejecuta la acción (el seguidor).
 */
const followUser = async (userIdToFollow, followerId) => {
    if (userIdToFollow === followerId)
        throw new Error("No puedes seguirte a ti mismo");

    try {
        // 1. Intentamos crear la relación de seguimiento
        await prisma.followers.create({
            data: {
                user_id: userIdToFollow,
                follower_id: followerId,
            },
        });

        // 2. Si tiene éxito, actualizamos los contadores de ambos usuarios en una transacción
        await prisma.$transaction([
            prisma.users.update({
                where: { id: userIdToFollow },
                data: { followers_count: { increment: 1 } },
            }),
            prisma.users.update({
                where: { id: followerId },
                data: { following_count: { increment: 1 } },
            }),
        ]);

        return { message: "Ahora sigues a este usuario" };
    } catch (error) {
        // P2002 significa que la relación ya existía (Violación de restricción única)
        if (error.code === "P2002")
            return { message: "Ya sigues a este usuario" };
        throw error;
    }
};

/**
 * Permite a un usuario dejar de seguir a otro y actualiza los contadores.
 */
const unfollowUser = async (
    userIdToUnfollow,
    followerId,
) => {
    try {
        // 1. Borramos la relación usando la clave compuesta generada por Prisma
        await prisma.followers.delete({
            where: {
                user_id_follower_id: {
                    user_id: userIdToUnfollow,
                    follower_id: followerId,
                },
            },
        });

        // 2. Decrementamos los contadores (usamos decrement para ser atómicos)
        // Nota: Asegúrate de que tu frontend y base de datos manejan bien que no baje de 0.
        await prisma.$transaction([
            prisma.users.update({
                where: { id: userIdToUnfollow },
                data: { followers_count: { decrement: 1 } },
            }),
            prisma.users.update({
                where: { id: followerId },
                data: { following_count: { decrement: 1 } },
            }),
        ]);

        return {
            message: "Has dejado de seguir al usuario",
        };
    } catch (error) {
        // P2025 significa que no se encontró el registro para borrar
        if (error.code === "P2025")
            return { message: "No seguías a este usuario" };
        throw error;
    }
};

/**
 * Obtiene la lista de usuarios que siguen a un usuario específico.
 */
const getFollowers = async (
    userId,
    { page = 1, limit = 20 },
) => {
    const safeLimit = Math.min(limit, 50);
    const offset = (page - 1) * safeLimit;

    const [total, followersList] =
        await prisma.$transaction([
            prisma.followers.count({
                where: { user_id: userId },
            }),
            prisma.followers.findMany({
                where: { user_id: userId },
                select: {
                    followed_at: true,
                    users_followers_follower_idTousers: {
                        // Obtenemos la info del seguidor
                        select: {
                            id: true,
                            username: true,
                            avatar: true,
                            bio: true,
                        },
                    },
                },
                orderBy: { followed_at: "desc" },
                skip: offset,
                take: safeLimit,
            }),
        ]);

    // Mapeamos para aplanar el resultado y dejarlo como lo espera el frontend
    const formattedData = followersList.map((f) => ({
        id: f.users_followers_follower_idTousers.id,
        username:
            f.users_followers_follower_idTousers.username,
        avatar: f.users_followers_follower_idTousers.avatar,
        bio: f.users_followers_follower_idTousers.bio,
        followed_at: f.followed_at,
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
 * Obtiene la lista de usuarios a los que sigue un usuario específico.
 */
const getFollowing = async (
    userId,
    { page = 1, limit = 20 },
) => {
    const safeLimit = Math.min(limit, 50);
    const offset = (page - 1) * safeLimit;

    const [total, followingList] =
        await prisma.$transaction([
            prisma.followers.count({
                where: { follower_id: userId },
            }),
            prisma.followers.findMany({
                where: { follower_id: userId },
                select: {
                    followed_at: true,
                    users_followers_user_idTousers: {
                        // Obtenemos la info del usuario seguido
                        select: {
                            id: true,
                            username: true,
                            avatar: true,
                            bio: true,
                        },
                    },
                },
                orderBy: { followed_at: "desc" },
                skip: offset,
                take: safeLimit,
            }),
        ]);

    const formattedData = followingList.map((f) => ({
        id: f.users_followers_user_idTousers.id,
        username: f.users_followers_user_idTousers.username,
        avatar: f.users_followers_user_idTousers.avatar,
        bio: f.users_followers_user_idTousers.bio,
        followed_at: f.followed_at,
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
 * Verifica si el usuario autenticado está siguiendo a un usuario específico.
 */
const checkFollow = async (userIdToCheck, followerId) => {
    const exists = await prisma.followers.findUnique({
        where: {
            user_id_follower_id: {
                user_id: userIdToCheck,
                follower_id: followerId,
            },
        },
    });
    return { isFollowing: !!exists };
};

export {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    checkFollow,
};
