import pool from "../config/db.js";
import { checkPermission } from "../utils/checkPermission.js";
import { deletePhysicalFile, deletePhysicalFolder } from "../utils/helper/file.helper.js";

/**
 * Crea un nuevo modelo junto con sus piezas, galería y etiquetas.
 */
const createModel = async (userId, data) => {
    if (!data) throw new Error("Faltan los datos del modelo");

    const { title, main_color, description, file_url, main_image_url, video_url, license, parts, images, tags } = data;
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const modelResult = await client.query(
            `INSERT INTO models (user_id, title, main_color, description, file_url, main_image_url, video_url, license)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [userId, title, main_color || null, description, file_url, main_image_url || null, video_url, license || "All Rights Reserved"]
        );

        const model = modelResult.rows[0];

        if (parts?.length > 0) {
            for (const part of parts) {
                await client.query(
                    `INSERT INTO model_parts (model_id, color, part_name, file_url, file_size) VALUES ($1,$2,$3,$4,$5)`,
                    [model.id, part.color || null, part.part_name, part.file_url, part.file_size]
                );
            }
        }

        if (images?.length > 0) {
            for (const image of images) {
                await client.query(
                    `INSERT INTO model_images (model_id, image_url, display_order) VALUES ($1,$2,$3)`,
                    [model.id, image, 0]
                );
            }
        }

        if (tags?.length > 0) {
            for (const tagId of tags) {
                await client.query(
                    `INSERT INTO model_tag (model_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
                    [model.id, tagId]
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

/**
 * Obtiene un modelo por ID sumando una visita y adjuntando sus relaciones.
 */
const getModelById = async (modelId) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const updateResult = await client.query(
            `UPDATE models SET views = views + 1 WHERE id = $1 RETURNING id`,
            [modelId]
        );

        if (updateResult.rows.length === 0) throw new Error("Modelo no encontrado");

        const query = `
            SELECT m.*, (SELECT COUNT(*) FROM model_likes WHERE model_id = m.id) AS likes,
            json_build_object('id', u.id, 'username', u.username, 'avatar', u.avatar) AS creator,
            COALESCE((SELECT json_agg(mp.*) FROM model_parts mp WHERE mp.model_id = m.id), '[]'::json) AS parts,
            COALESCE((SELECT json_agg(mi.* ORDER BY mi.display_order) FROM model_images mi WHERE mi.model_id = m.id), '[]'::json) AS images,
            COALESCE((SELECT json_agg(json_build_object('id', t.id, 'name', t.name)) 
                      FROM model_tag mt JOIN tags t ON mt.tag_id = t.id WHERE mt.model_id = m.id), '[]'::json) AS tags
            FROM models m JOIN users u ON m.user_id = u.id WHERE m.id = $1
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

/**
 * Lista modelos paginados con información del creador y etiquetas.
 */
const getModels = async ({ page = 1, limit = 20 }) => {
    const safeLimit = Math.min(limit, 50);
    const offset = (page - 1) * safeLimit;

    const modelsQuery = `
        SELECT m.*, (SELECT COUNT(*) FROM model_likes WHERE model_id = m.id) AS likes,
        json_build_object('id', u.id, 'username', u.username, 'avatar', u.avatar) AS creator,
        COALESCE((SELECT json_agg(json_build_object('id', t.id, 'name', t.name)) 
                  FROM model_tag mt JOIN tags t ON mt.tag_id = t.id WHERE mt.model_id = m.id), '[]'::json) AS tags
        FROM models m JOIN users u ON m.user_id = u.id ORDER BY m.created_at DESC LIMIT $1 OFFSET $2
    `;

    const countResult = await pool.query(`SELECT COUNT(*) FROM models`);
    const modelsResult = await pool.query(modelsQuery, [safeLimit, offset]);
    const total = parseInt(countResult.rows[0].count, 10);

    return {
        page, limit: safeLimit, total, totalPages: Math.ceil(total / safeLimit), data: modelsResult.rows,
    };
};

/**
 * Lista modelos creados por un usuario específico de forma paginada.
 */
const getModelsByUser = async (userId, { page = 1, limit = 20 }) => {
    const safeLimit = Math.min(limit, 50);
    const offset = (page - 1) * safeLimit;

    const modelsQuery = `
        SELECT m.*, (SELECT COUNT(*) FROM model_likes WHERE model_id = m.id) AS likes,
        json_build_object('id', u.id, 'username', u.username, 'avatar', u.avatar) AS creator,
        COALESCE((SELECT json_agg(json_build_object('id', t.id, 'name', t.name)) 
                  FROM model_tag mt JOIN tags t ON mt.tag_id = t.id WHERE mt.model_id = m.id), '[]'::json) AS tags
        FROM models m JOIN users u ON m.user_id = u.id WHERE m.user_id = $1 ORDER BY m.created_at DESC LIMIT $2 OFFSET $3
    `;

    const countResult = await pool.query(`SELECT COUNT(*) FROM models WHERE user_id = $1`, [userId]);
    const modelsResult = await pool.query(modelsQuery, [userId, safeLimit, offset]);
    const total = parseInt(countResult.rows[0].count, 10);

    return {
        page, limit: safeLimit, total, totalPages: Math.ceil(total / safeLimit), data: modelsResult.rows,
    };
};

/**
 * Elimina un modelo de la BD y toda su carpeta física.
 */
const deleteModel = async (modelId, user) => {
    const client = await pool.connect();
    try {
        const result = await client.query("SELECT user_id, file_url FROM models WHERE id = $1", [modelId]);
        if (result.rows.length === 0) throw new Error("Modelo no encontrado");

        checkPermission(result.rows[0].user_id, user);

        const fileUrl = result.rows[0].file_url;
        await client.query("DELETE FROM models WHERE id = $1", [modelId]);
        
        deletePhysicalFolder(fileUrl); // Limpieza física con el helper

        return { message: "Modelo y archivos eliminados correctamente" };
    } finally {
        client.release();
    }
};

/**
 * Actualiza la información textual del modelo.
 */
const updateModel = async (modelId, user, data) => {
    const client = await pool.connect();
    try {
        const result = await client.query(`SELECT user_id FROM models WHERE id = $1`, [modelId]);
        if (result.rows.length === 0) throw new Error("Modelo no encontrado");

        checkPermission(result.rows[0].user_id, user);

        const fields = [];
        const values = [];
        let index = 1;
        const allowedFields = ["title", "description", "main_color", "license", "video_url"];

        for (const field of allowedFields) {
            if (data[field] !== undefined) {
                fields.push(`${field} = $${index++}`);
                values.push(data[field]);
            }
        }

        if (fields.length === 0) throw new Error("No hay campos para actualizar");

        const query = `UPDATE models SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = $${index} RETURNING *`;
        values.push(modelId);

        const updateResult = await client.query(query, values);
        return updateResult.rows[0];
    } finally {
        client.release();
    }
};

/**
 * Añade un like a un modelo.
 */
const addLike = async (modelId, userId) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        await client.query(`INSERT INTO model_likes (user_id, model_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`, [userId, modelId]);
        const countResult = await client.query(`SELECT COUNT(*) FROM model_likes WHERE model_id = $1`, [modelId]);
        await client.query("COMMIT");
        return { likes: parseInt(countResult.rows[0].count, 10) };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

/**
 * Elimina un like de un modelo.
 */
const removeLike = async (modelId, userId) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        await client.query(`DELETE FROM model_likes WHERE user_id = $1 AND model_id = $2`, [userId, modelId]);
        const countResult = await client.query(`SELECT COUNT(*) FROM model_likes WHERE model_id = $1`, [modelId]);
        await client.query("COMMIT");
        return { likes: parseInt(countResult.rows[0].count, 10) };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

/**
 * Reemplaza la imagen de portada en la BD y borra físicamente la anterior.
 */
const updateMainImage = async (modelId, user, imageUrl) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const result = await client.query("SELECT user_id, main_image_url FROM models WHERE id = $1", [modelId]);

        if (result.rows.length === 0) throw new Error("Modelo no encontrado");
        checkPermission(result.rows[0].user_id, user);

        const oldImageUrl = result.rows[0].main_image_url;
        const updateResult = await client.query(
            "UPDATE models SET main_image_url = $1 WHERE id = $2 RETURNING *",
            [imageUrl, modelId]
        );

        if (oldImageUrl && oldImageUrl !== imageUrl) deletePhysicalFile(oldImageUrl);

        await client.query("COMMIT");
        return updateResult.rows[0];
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

/**
 * Borra la imagen principal de la BD y del disco duro.
 */
const deleteMainImage = async (modelId, user) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const result = await client.query("SELECT user_id, main_image_url FROM models WHERE id = $1", [modelId]);

        if (result.rows.length === 0) throw new Error("Modelo no encontrado");
        checkPermission(result.rows[0].user_id, user);

        const imageUrl = result.rows[0].main_image_url;
        if (!imageUrl) throw new Error("El modelo ya no tiene imagen principal");

        await client.query("UPDATE models SET main_image_url = NULL WHERE id = $1", [modelId]);
        deletePhysicalFile(imageUrl);

        await client.query("COMMIT");
        return { message: "Imagen principal eliminada correctamente" };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

/**
 * Reemplaza el archivo principal 3D en la BD y borra físicamente el anterior.
 */
const replaceMainFile = async (modelId, user, newFileUrl) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const result = await client.query("SELECT user_id, file_url FROM models WHERE id = $1", [modelId]);

        if (result.rows.length === 0) throw new Error("Modelo no encontrado");
        checkPermission(result.rows[0].user_id, user);

        const oldFileUrl = result.rows[0].file_url;
        const updateResult = await client.query(
            "UPDATE models SET file_url = $1 WHERE id = $2 RETURNING *",
            [newFileUrl, modelId]
        );

        if (oldFileUrl && oldFileUrl !== newFileUrl) deletePhysicalFile(oldFileUrl);

        await client.query("COMMIT");
        return updateResult.rows[0];
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
    getModelsByUser,
    deleteModel,
    updateModel,
    addLike,
    removeLike,
    updateMainImage,
    deleteMainImage,
    replaceMainFile,
};