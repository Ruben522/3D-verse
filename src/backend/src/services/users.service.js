import pool from "../config/db.js";

const getUserFavorites = async (userId) => {
    const result = await pool.query(
        `
    SELECT 
      m.id,
      m.title,
      m.main_image_url,
      m.likes,
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

export { getUserFavorites };
