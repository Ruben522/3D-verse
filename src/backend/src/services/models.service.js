import pool from "../config/db.js";

const createModel = async (userId, data) => {
    const {
        title,
        main_color,
        description,
        file_url,
        main_image_url,
        video_url,
        license,
        parts,
        images,
    } = data;

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const modelResult = await client.query(
            `INSERT INTO models 
        (user_id, title, main_color, description, file_url, main_image_url, video_url, license)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING id, user_id, title, main_color, description, file_url,
                 main_image_url, video_url, license,
                 downloads, likes, views, created_at, updated_at`,
            [
                userId,
                title,
                main_color,
                description,
                file_url,
                main_image_url,
                video_url,
                license,
            ],
        );

        const model = modelResult.rows[0];

        if (parts && parts.length > 0) {
            for (const part of parts) {
                await client.query(
                    `INSERT INTO model_parts
           (model_id, color, part_name, file_url, file_size)
           VALUES ($1,$2,$3,$4,$5)`,
                    [
                        model.id,
                        part.color || null,
                        part.part_name,
                        part.file_url,
                        part.file_size,
                    ],
                );
            }
        }

        if (images && images.length > 0) {
            for (const image of images) {
                await client.query(
                    `INSERT INTO model_images
           (model_id, image_url, display_order)
           VALUES ($1,$2,$3)`,
                    [
                        model.id,
                        image.image_url,
                        image.display_order || 0,
                    ],
                );
            }
        }

        await client.query("COMMIT");

        return model;
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

const getModelById = async (modelId) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const updateResult = await client.query(
            `UPDATE models
       SET views = views + 1
       WHERE id = $1
       RETURNING id`,
            [modelId],
        );

        if (updateResult.rows.length === 0) {
            throw new Error("Modelo no encontrado");
        }

        const query = `
      SELECT 
        m.id,
        m.title,
        m.main_color,
        m.description,
        m.file_url,
        m.main_image_url,
        m.video_url,
        m.license,
        m.downloads,
        m.views,
        m.created_at,
        m.updated_at,

        json_build_object(
          'id', u.id,
          'username', u.username,
          'avatar', u.avatar
        ) AS creator,

        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', mp.id,
                'color', mp.color,
                'part_name', mp.part_name,
                'file_url', mp.file_url,
                'file_size', mp.file_size,
                'created_at', mp.created_at
              )
            )
            FROM model_parts mp
            WHERE mp.model_id = m.id
          ), '[]'
        ) AS parts,

        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', mi.id,
                'image_url', mi.image_url,
                'display_order', mi.display_order
              )
              ORDER BY mi.display_order
            )
            FROM model_images mi
            WHERE mi.model_id = m.id
          ), '[]'
        ) AS images

      FROM models m
      JOIN users u ON m.user_id = u.id
      WHERE m.id = $1
    `;

        const result = await client.query(query, [modelId]);

        await client.query("COMMIT");

        return result.rows[0];
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

const getModels = async ({ page = 1, limit = 20 }) => {
    const safeLimit = Math.min(limit, 50);
    const offset = (page - 1) * safeLimit;

    const modelsQuery = `
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

    FROM models m
    JOIN users u ON m.user_id = u.id
    ORDER BY m.created_at DESC
    LIMIT $1
    OFFSET $2
  `;

    const countQuery = `SELECT COUNT(*) FROM models`;

    const [modelsResult, countResult] = await Promise.all([
        pool.query(modelsQuery, [safeLimit, offset]),
        pool.query(countQuery),
    ]);

    const total = parseInt(countResult.rows[0].count, 10);

    return {
        page,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
        data: modelsResult.rows,
    };
};

const deleteModel = async (modelId, user) => {
    const client = await pool.connect();

    try {
        const result = await client.query(
            "SELECT user_id FROM models WHERE id = $1",
            [modelId],
        );

        if (result.rows.length === 0) {
            throw new Error("Modelo no encontrado");
        }

        const model = result.rows[0];

        const isOwner = model.user_id === user.id;
        const isAdmin = user.role === "admin";

        if (!isOwner && !isAdmin) {
            throw new Error("No autorizado");
        }

        await client.query(
            "DELETE FROM models WHERE id = $1",
            [modelId],
        );

        return {
            message: "Modelo eliminado correctamente",
        };
    } finally {
        client.release();
    }
};

const updateModel = async (modelId, user, data) => {
    const client = await pool.connect();

    try {
        const result = await client.query(
            "SELECT user_id FROM models WHERE id = $1",
            [modelId],
        );

        if (result.rows.length === 0) {
            throw new Error("Modelo no encontrado");
        }

        const model = result.rows[0];

        const isOwner = model.user_id === user.id;
        const isAdmin = user.role === "admin";

        if (!isOwner && !isAdmin) {
            throw new Error("No autorizado");
        }

        const fields = [];
        const values = [];
        let index = 1;

        const allowedFields = [
            "title",
            "description",
            "main_color",
            "license",
            "video_url",
            "main_image_url",
        ];

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
      UPDATE models
      SET ${fields.join(", ")}
      WHERE id = $${index}
      RETURNING id, title, main_color, description, file_url,
                main_image_url, video_url, license,
                downloads, likes, views, created_at, updated_at
    `;

        values.push(modelId);

        const updateResult = await client.query(
            query,
            values,
        );

        return updateResult.rows[0];
    } finally {
        client.release();
    }
};

const downloadModel = async (
    modelId,
    user,
    ip,
    userAgent,
) => {
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

        await client.query(
            `INSERT INTO downloads (user_id, model_id, ip_address, user_agent)
       VALUES ($1,$2,$3,$4)`,
            [user ? user.id : null, modelId, ip, userAgent],
        );

        await client.query(
            `UPDATE models
       SET downloads = downloads + 1
       WHERE id = $1`,
            [modelId],
        );

        await client.query("COMMIT");

        return {
            message: "Descarga registrada correctamente",
        };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

const addFavorite = async (modelId, userId) => {
    try {
        await pool.query(
            `INSERT INTO favorites (user_id, model_id)
       VALUES ($1,$2)
       ON CONFLICT (user_id, model_id) DO NOTHING`,
            [userId, modelId],
        );

        return { message: "Añadido a favoritos" };
    } catch (error) {
        throw error;
    }
};

const removeFavorite = async (modelId, userId) => {
    await pool.query(
        `DELETE FROM favorites
     WHERE user_id = $1 AND model_id = $2`,
        [userId, modelId],
    );

    return { message: "Eliminado de favoritos" };
};

const addLike = async (modelId, userId) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const insertResult = await client.query(
            `INSERT INTO model_likes (user_id, model_id)
       VALUES ($1,$2)
       ON CONFLICT DO NOTHING
       RETURNING *`,
            [userId, modelId],
        );

        if (insertResult.rows.length === 0) {
            await client.query("ROLLBACK");
            return { message: "Ya habías dado like" };
        }

        const updateResult = await client.query(
            `UPDATE models
       SET likes = likes + 1
       WHERE id = $1
       RETURNING likes`,
            [modelId],
        );

        await client.query("COMMIT");

        return { likes: updateResult.rows[0].likes };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

const removeLike = async (modelId, userId) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const deleteResult = await client.query(
            `DELETE FROM model_likes
       WHERE user_id = $1 AND model_id = $2
       RETURNING *`,
            [userId, modelId],
        );

        if (deleteResult.rows.length === 0) {
            await client.query("ROLLBACK");
            return { message: "No habías dado like" };
        }

        const updateResult = await client.query(
            `UPDATE models
       SET likes = GREATEST(likes - 1, 0)
       WHERE id = $1
       RETURNING likes`,
            [modelId],
        );

        await client.query("COMMIT");

        return { likes: updateResult.rows[0].likes };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

export {
    createModel,
    getModelById,
    getModels,
    deleteModel,
    downloadModel,
    updateModel,
    addFavorite,
    removeFavorite,
    addLike,
    removeLike,
};
