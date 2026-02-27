import pool from "../config/db.js";

const addFavorite = async (modelId, userId) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const modelResult = await client.query(
            "SELECT id FROM models WHERE id = $1",
            [modelId],
        );

        if (modelResult.rows.length === 0) {
            throw new Error("Modelo no encontrado");
        }

        const insertResult = await client.query(
            `INSERT INTO favorites (user_id, model_id)
             VALUES ($1,$2)
             ON CONFLICT DO NOTHING
             RETURNING *`,
            [userId, modelId],
        );

        if (insertResult.rows.length === 0) {
            await client.query("ROLLBACK");
            return { message: "Ya estaba en favoritos" };
        }

        await client.query("COMMIT");

        return { message: "Añadido a favoritos" };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

const removeFavorite = async (modelId, userId) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const deleteResult = await client.query(
            `DELETE FROM favorites
             WHERE user_id = $1 AND model_id = $2
             RETURNING *`,
            [userId, modelId],
        );

        if (deleteResult.rows.length === 0) {
            await client.query("ROLLBACK");
            return { message: "No estaba en favoritos" };
        }

        await client.query("COMMIT");

        return { message: "Eliminado de favoritos" };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

const getUserFavorites = async (
    userId,
    { page = 1, limit = 20 },
) => {
    const safeLimit = Math.min(limit, 50);
    const offset = (page - 1) * safeLimit;

    const query = `
        SELECT 
            m.id,
            m.title,
            m.main_color,
            m.description,
            m.main_image_url,
            m.downloads,
            m.views,
            m.created_at,

            json_build_object(
                'id', u.id,
                'username', u.username,
                'avatar', u.avatar
            ) AS creator

        FROM favorites f
        JOIN models m ON f.model_id = m.id
        JOIN users u ON m.user_id = u.id
        WHERE f.user_id = $1
        ORDER BY f.created_at DESC
        LIMIT $2 OFFSET $3
    `;

    const countQuery = `
        SELECT COUNT(*) 
        FROM favorites 
        WHERE user_id = $1
    `;

    const [favoritesResult, countResult] =
        await Promise.all([
            pool.query(query, [userId, safeLimit, offset]),
            pool.query(countQuery, [userId]),
        ]);

    const total = parseInt(countResult.rows[0].count, 10);

    return {
        page,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
        data: favoritesResult.rows,
    };
};

const checkFavorite = async (modelId, userId) => {
    const result = await pool.query(
        `SELECT 1 FROM favorites
         WHERE user_id = $1 AND model_id = $2`,
        [userId, modelId],
    );

    return { isFavorite: result.rows.length > 0 };
};

export {
    addFavorite,
    removeFavorite,
    getUserFavorites,
    checkFavorite,
};
