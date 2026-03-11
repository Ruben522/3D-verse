import prisma from "../config/prisma.js";

/**
 * Permite que un usuario siga a otro usuario.
 * Actualiza los contadores de seguidores y seguidos en una transacción.
 * Es idempotente: si ya se seguía, retorna mensaje informativo sin error.
 *
 * @param {string} userIdToFollow - ID del usuario que se desea seguir
 * @param {string} followerId - ID del usuario que realiza la acción (el seguidor)
 * @returns {Promise<{ message: string }>} Mensaje de resultado
 * @throws {Error} Si se intenta seguir a uno mismo
 * @throws {Error} Error genérico de base de datos (excepto duplicado P2002)
 */
const followUser = async (userIdToFollow, followerId) => {
  if (userIdToFollow === followerId) {
    throw new Error("No puedes seguirte a ti mismo");
  }

  try {
    await prisma.followers.create({
      data: {
        user_id: userIdToFollow,
        follower_id: followerId,
      },
    });

    await prisma.$transaction([
      prisma.profiles.update({
        where: { user_id: userIdToFollow },
        data: { followers_count: { increment: 1 } },
      }),
      prisma.profiles.update({
        where: { user_id: followerId },
        data: { following_count: { increment: 1 } },
      }),
    ]);

    return { message: "Ahora sigues a este usuario" };
  } catch (error) {
    if (error.code === "P2002") {
      return { message: "Ya sigues a este usuario" };
    }
    throw error;
  }
};

/**
 * Permite que un usuario deje de seguir a otro.
 * Actualiza los contadores de seguidores y seguidos en una transacción.
 * Es idempotente: si no se seguía, retorna mensaje informativo sin error.
 *
 * @param {string} userIdToUnfollow - ID del usuario que se desea dejar de seguir
 * @param {string} followerId - ID del usuario que realiza la acción
 * @returns {Promise<{ message: string }>} Mensaje de resultado
 * @throws {Error} Error genérico de base de datos (excepto no encontrado P2025)
 */
const unfollowUser = async (userIdToUnfollow, followerId) => {
  try {
    await prisma.followers.delete({
      where: {
        user_id_follower_id: {
          user_id: userIdToUnfollow,
          follower_id: followerId,
        },
      },
    });

    await prisma.$transaction([
      prisma.profiles.update({
        where: { user_id: userIdToUnfollow },
        data: { followers_count: { decrement: 1 } },
      }),
      prisma.profiles.update({
        where: { user_id: followerId },
        data: { following_count: { decrement: 1 } },
      }),
    ]);

    return {
      message: "Has dejado de seguir al usuario",
    };
  } catch (error) {
    if (error.code === "P2025") {
      return { message: "No seguías a este usuario" };
    }
    throw error;
  }
};

/**
 * Obtiene la lista paginada de usuarios que siguen a un usuario específico.
 * Devuelve información básica del seguidor + fecha en que comenzó a seguir.
 *
 * @param {string} userId - ID del usuario cuyos seguidores se quieren obtener
 * @param {Object} [options] - Opciones de paginación
 * @param {number} [options.page=1] - Página solicitada (base 1)
 * @param {number} [options.limit=20] - Cantidad de registros por página (máx 50)
 * @returns {Promise<Object>} Resultado paginado
 * @property {number} page - Página actual
 * @property {number} limit - Registros por página
 * @property {number} total - Total de seguidores
 * @property {number} totalPages - Total de páginas
 * @property {Array<{ id: string, username: string, avatar: string|null, bio: string|null, followed_at: Date }>} data - Lista de seguidores
 */
const getFollowers = async (userId, { page = 1, limit = 20 } = {}) => {
  const safeLimit = Math.min(limit, 50);
  const offset = (page - 1) * safeLimit;

  const [total, followersList] = await prisma.$transaction([
    prisma.followers.count({
      where: { user_id: userId },
    }),
    prisma.followers.findMany({
      where: { user_id: userId },
      select: {
        followed_at: true,
        users_followers_follower_idTousers: {
          select: {
            id: true,
            profile: {
              select: {
                username: true,
                avatar: true,
                bio: true,
              },
            },
          },
        },
      },
      orderBy: { followed_at: "desc" },
      skip: offset,
      take: safeLimit,
    }),
  ]);

  const formattedData = followersList.map((f) => ({
    id: f.users_followers_follower_idTousers.id,
    username: f.users_followers_follower_idTousers.profile?.username,
    avatar: f.users_followers_follower_idTousers.profile?.avatar,
    bio: f.users_followers_follower_idTousers.profile?.bio,
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
 * Obtiene la lista paginada de usuarios que un usuario específico está siguiendo.
 * Devuelve información básica del usuario seguido + fecha en que se comenzó a seguir.
 *
 * @param {string} userId - ID del usuario cuyos seguidos se quieren obtener
 * @param {Object} [options] - Opciones de paginación
 * @param {number} [options.page=1] - Página solicitada
 * @param {number} [options.limit=20] - Cantidad de registros por página (máx 50)
 * @returns {Promise<Object>} Resultado paginado
 * @property {number} page - Página actual
 * @property {number} limit - Registros por página
 * @property {number} total - Total de usuarios seguidos
 * @property {number} totalPages - Total de páginas
 * @property {Array<{ id: string, username: string, avatar: string|null, bio: string|null, followed_at: Date }>} data - Lista de seguidos
 */
const getFollowing = async (userId, { page = 1, limit = 20 } = {}) => {
  const safeLimit = Math.min(limit, 50);
  const offset = (page - 1) * safeLimit;

  const [total, followingList] = await prisma.$transaction([
    prisma.followers.count({
      where: { follower_id: userId },
    }),
    prisma.followers.findMany({
      where: { follower_id: userId },
      select: {
        followed_at: true,
        users_followers_user_idTousers: {
          select: {
            id: true,
            profile: {
              select: {
                username: true,
                avatar: true,
                bio: true,
              },
            },
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
        username: f.users_followers_user_idTousers.profile?.username,
        avatar: f.users_followers_user_idTousers.profile?.avatar,
        bio: f.users_followers_user_idTousers.profile?.bio,
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
 * Verifica si un usuario está siguiendo a otro usuario específico.
 *
 * @param {string} userIdToCheck - ID del usuario que podría estar siendo seguido
 * @param {string} followerId - ID del posible seguidor
 * @returns {Promise<{ isFollowing: boolean }>} Resultado de la verificación
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

export { followUser, unfollowUser, getFollowers, getFollowing, checkFollow };
