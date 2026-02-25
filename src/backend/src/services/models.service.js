import pool from "../config/db.js";

const createModel = async (userId, data) => {
  const {
    title,
    description,
    file_url,
    main_image_url,
    video_url,
    license,
    parts,
    images
  } = data;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const modelResult = await client.query(
      `INSERT INTO models 
        (user_id, title, description, file_url, main_image_url, video_url, license)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [
        userId,
        title,
        description,
        file_url,
        main_image_url,
        video_url,
        license
      ]
    );

    const model = modelResult.rows[0];

    if (parts && parts.length > 0) {
      for (const part of parts) {
        await client.query(
          `INSERT INTO model_parts
           (model_id, part_name, file_url, file_size)
           VALUES ($1,$2,$3,$4)`,
          [
            model.id,
            part.part_name,
            part.file_url,
            part.file_size
          ]
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
            image.display_order || 0
          ]
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
  const query = `
    SELECT 
      m.id,
      m.title,
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

  const result = await pool.query(query, [modelId]);

  if (result.rows.length === 0) {
    throw new Error("Modelo no encontrado");
  }

  return result.rows[0];
};

const getModels = async ({ page = 1, limit = 20 }) => {
  const safeLimit = Math.min(limit, 50);
  const offset = (page - 1) * safeLimit;
  
  const modelsQuery = `
    SELECT 
      m.id,
      m.title,
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

  const countQuery = `
    SELECT COUNT(*) FROM models
  `;

  const [modelsResult, countResult] = await Promise.all([
    pool.query(modelsQuery, [safeLimit, offset]),
    pool.query(countQuery)
  ]);

  const total = parseInt(countResult.rows[0].count, 10);

  return {
    page,
    limit: safeLimit,
    total,
    totalPages: Math.ceil(total / safeLimit),
    data: modelsResult.rows
  };
};

export {
  createModel,
  getModelById,
  getModels,
};