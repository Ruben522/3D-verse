import pool from "../config/db.js";

const checkUserAndPermissions = async (
    client,
    targetUserId,
    currentUser,
) => {
    const targetResult = await client.query(
        "SELECT id FROM users WHERE id = $1",
        [targetUserId],
    );

    if (targetResult.rows.length === 0) {
        throw new Error("Usuario no encontrado");
    }

    const currentResult = await client.query(
        "SELECT role FROM users WHERE id = $1",
        [currentUser.id],
    );

    const actualRole =
        currentResult.rows.length > 0
            ? currentResult.rows[0].role
            : null;

    const isOwner =
        String(currentUser.id) === String(targetUserId);
    const isAdmin = actualRole === "admin";

    if (!isOwner && !isAdmin) {
        throw new Error("No autorizado");
    }
};

const getUserFavorites = async (userId) => {
    const result = await pool.query(
        `
    SELECT 
      m.id,
      m.title,
      m.main_image_url,
      m.downloads,
      m.views,
      m.created_at
    FROM favorites f
    JOIN models m ON f.model_id = m.id
    WHERE f.user_id = $1
    ORDER BY f.created_at DESC
    `,
        [userId],
    );

    return result.rows;
};

const getUserById = async (userId) => {
    const query = `
    SELECT 
      u.id, u.name, u.lastname, u.username, u.avatar,
      u.bio, u.youtube, u.twitter, u.linkedin, u.github,
      u.location, u.role, u.created_at,
      (SELECT COUNT(*) FROM models m WHERE m.user_id = u.id) AS models_count,
      (SELECT COUNT(*) FROM followers f WHERE f.user_id = u.id) AS followers_count,
      (SELECT COUNT(*) FROM followers f WHERE f.follower_id = u.id) AS following_count
    FROM users u
    WHERE u.id = $1
  `;

    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
        throw new Error("Usuario no encontrado");
    }

    return result.rows[0];
};

const getUsers = async ({ page = 1, limit = 20 }) => {
    const safeLimit = Math.min(limit, 50);
    const offset = (page - 1) * safeLimit;

    const usersQuery = `
    SELECT 
      id, name, lastname, username, avatar, bio, youtube,
      twitter, linkedin, github, location, role, created_at
    FROM users
    ORDER BY created_at DESC
    LIMIT $1 OFFSET $2
  `;

    const countQuery = `SELECT COUNT(*) FROM users`;

    const [usersResult, countResult] = await Promise.all([
        pool.query(usersQuery, [safeLimit, offset]),
        pool.query(countQuery),
    ]);

    const total = parseInt(countResult.rows[0].count, 10);

    return {
        page,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
        data: usersResult.rows,
    };
};

const updateUser = async (userId, currentUser, data) => {
    const client = await pool.connect();

    try {
        await checkUserAndPermissions(
            client,
            userId,
            currentUser,
        );

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

        const fields = [];
        const values = [];
        let index = 1;

        for (const field of allowedFields) {
            if (data[field] !== undefined) {
                fields.push(`${field} = $${index}`);
                values.push(data[field]);
                index++;
            }
        }

        if (fields.length === 0) {
            throw new Error(
                "No hay campos para actualizar",
            );
        }

        fields.push(`updated_at = CURRENT_TIMESTAMP`);

        const query = `
      UPDATE users
      SET ${fields.join(", ")}
      WHERE id = $${index}
      RETURNING 
        id, name, lastname, username, avatar,
        bio, youtube, twitter, linkedin, github,
        location, role, created_at, updated_at
    `;

        values.push(userId);
        const updateResult = await client.query(
            query,
            values,
        );

        return updateResult.rows[0];
    } finally {
        client.release();
    }
};

const deleteUser = async (userId, currentUser) => {
    const client = await pool.connect();

    try {
        await checkUserAndPermissions(
            client,
            userId,
            currentUser,
        );

        await client.query(
            "DELETE FROM users WHERE id = $1",
            [userId],
        );

        return {
            message: "Usuario eliminado correctamente",
        };
    } finally {
        client.release();
    }
};

export {
    getUserFavorites,
    getUsers,
    updateUser,
    deleteUser,
    getUserById,
};
