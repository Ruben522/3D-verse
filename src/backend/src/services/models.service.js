import pool from "../config/db.js";
import fs from "fs";
import path from "path";
import { checkPermission } from "../utils/checkPermission.js"; // Asegúrate de que la ruta sea correcta

const createModel = async (userId, data) => {
    if (!data)
        throw new Error("Faltan los datos del modelo");

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
        tags,
    } = data;

    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // PASO 1: Crear modelo
        const modelResult = await client.query(
            `INSERT INTO models (user_id, title, main_color, description, file_url, main_image_url, video_url, license)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
             RETURNING *`,
            [
                userId,
                title,
                main_color || null,
                description,
                file_url,
                main_image_url || null,
                video_url,
                license || "All Rights Reserved",
            ],
        );

        const model = modelResult.rows[0];

        // PASO 2: Guardar partes si existen
        if (parts && parts.length > 0) {
            for (const part of parts) {
                await client.query(
                    `INSERT INTO model_parts (model_id, color, part_name, file_url, file_size)
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

        // PASO 3: Guardar imágenes de galería si existen
        if (images && images.length > 0) {
            for (const image of images) {
                await client.query(
                    `INSERT INTO model_images (model_id, image_url, display_order)
                     VALUES ($1,$2,$3)`,
                    [model.id, image, 0], // Asumimos que "image" es el string de la URL
                );
            }
        }

        // PASO 4: Guardar tags si existen
        if (tags && tags.length > 0) {
            for (const tagId of tags) {
                await client.query(
                    `INSERT INTO model_tag (model_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
                    [model.id, tagId],
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
            `UPDATE models SET views = views + 1 WHERE id = $1 RETURNING id`,
            [modelId],
        );

        if (updateResult.rows.length === 0)
            throw new Error("Modelo no encontrado");

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

    const countResult = await pool.query(
        `SELECT COUNT(*) FROM models`,
    );
    const modelsResult = await pool.query(modelsQuery, [
        safeLimit,
        offset,
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

// src/services/models.service.js
const deleteModel = async (modelId, user) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            "SELECT user_id, file_url FROM models WHERE id = $1",
            [modelId],
        );
        if (result.rows.length === 0)
            throw new Error("Modelo no encontrado");

        // Verificamos permisos
        checkPermission(result.rows[0].user_id, user);

        // 1. Normalizamos la ruta (quitamos la barra inicial para Windows)
        const relativePath = path.normalize(
            result.rows[0].file_url.startsWith("/")
                ? result.rows[0].file_url.slice(1)
                : result.rows[0].file_url,
        );

        // 2. Calculamos la carpeta absoluta correcta dentro de tu proyecto
        const absoluteFolder = path.dirname(
            path.resolve(process.cwd(), relativePath),
        );

        // 3. Borramos de la BD
        await client.query(
            "DELETE FROM models WHERE id = $1",
            [modelId],
        );

        // 4. Borramos la carpeta física (recursive: true borra las subcarpetas parts/ y gallery/)
        if (fs.existsSync(absoluteFolder)) {
            fs.rmSync(absoluteFolder, {
                recursive: true,
                force: true,
            });
        }

        return {
            message:
                "Modelo y archivos eliminados correctamente",
        };
    } finally {
        client.release();
    }
};

const updateModel = async (modelId, user, data) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            `SELECT user_id FROM models WHERE id = $1`,
            [modelId],
        );
        if (result.rows.length === 0)
            throw new Error("Modelo no encontrado");

        checkPermission(result.rows[0].user_id, user);

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
                fields.push(`${field} = $${index++}`);
                values.push(data[field]);
            }
        }

        if (fields.length === 0)
            throw new Error(
                "No hay campos para actualizar",
            );

        const query = `UPDATE models SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = $${index} RETURNING *`;
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

const addLike = async (modelId, userId) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        await client.query(
            `INSERT INTO model_likes (user_id, model_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`,
            [userId, modelId],
        );
        const countResult = await client.query(
            `SELECT COUNT(*) FROM model_likes WHERE model_id = $1`,
            [modelId],
        );
        await client.query("COMMIT");
        return {
            likes: parseInt(countResult.rows[0].count, 10),
        };
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
        await client.query(
            `DELETE FROM model_likes WHERE user_id = $1 AND model_id = $2`,
            [userId, modelId],
        );
        const countResult = await client.query(
            `SELECT COUNT(*) FROM model_likes WHERE model_id = $1`,
            [modelId],
        );
        await client.query("COMMIT");
        return {
            likes: parseInt(countResult.rows[0].count, 10),
        };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

const updateMainImage = async (modelId, user, imageUrl) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const result = await client.query(
            "SELECT user_id, main_image_url FROM models WHERE id = $1",
            [modelId],
        );

        if (result.rows.length === 0)
            throw new Error("Modelo no encontrado");
        checkPermission(result.rows[0].user_id, user);

        const oldImageUrl = result.rows[0].main_image_url;

        if (oldImageUrl) {
            const relativePath = path.normalize(
                oldImageUrl.startsWith("/")
                    ? oldImageUrl.slice(1)
                    : oldImageUrl,
            );
            const absolutePath = path.resolve(
                process.cwd(),
                relativePath,
            );
            if (fs.existsSync(absolutePath)) {
                fs.unlinkSync(absolutePath);
            }
        }

        const updateResult = await client.query(
            "UPDATE models SET main_image_url = $1 WHERE id = $2 RETURNING *",
            [imageUrl, modelId],
        );

        await client.query("COMMIT");
        return updateResult.rows[0];
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

const deleteMainImage = async (modelId, user) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const result = await client.query(
            "SELECT user_id, main_image_url FROM models WHERE id = $1",
            [modelId],
        );

        if (result.rows.length === 0)
            throw new Error("Modelo no encontrado");
        checkPermission(result.rows[0].user_id, user);

        const imageUrl = result.rows[0].main_image_url;
        if (!imageUrl)
            throw new Error(
                "El modelo ya no tiene imagen principal",
            );

        await client.query(
            "UPDATE models SET main_image_url = NULL WHERE id = $1",
            [modelId],
        );

        const relativePath = path.normalize(
            imageUrl.startsWith("/")
                ? imageUrl.slice(1)
                : imageUrl,
        );
        const absolutePath = path.resolve(
            process.cwd(),
            relativePath,
        );

        console.log(
            "-> Intentando borrar portada física en:",
            absolutePath,
        );

        try {
            if (fs.existsSync(absolutePath)) {
                fs.unlinkSync(absolutePath);
                message.log(
                    "Imagen principal eliminada del disco correctamente.",
                );
            } else {
                message.log(
                    "El archivo no existía en el disco, pero se limpió de la BD.",
                );
            }
        } catch (fsError) {}

        await client.query("COMMIT");
        return {
            message:
                "Imagen principal eliminada correctamente",
        };
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
    updateModel,
    addLike,
    removeLike,
    updateMainImage,
    deleteMainImage,
};
