import pool from "../config/db.js";
import fs from "fs";
import path from "path";
import { checkPermission } from "../utils/checkPermission.js";

const addImage = async (
    user,
    modelId,
    imageUrl,
    displayOrder = 0,
) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const modelResult = await client.query(
            "SELECT user_id FROM models WHERE id = $1",
            [modelId],
        );

        if (modelResult.rows.length === 0)
            throw new Error("Modelo no encontrado");

        checkPermission(modelResult.rows[0].user_id, user);

        const insertResult = await client.query(
            `INSERT INTO model_images (model_id, image_url, display_order)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [modelId, imageUrl, displayOrder],
        );

        await client.query("COMMIT");
        return insertResult.rows[0];
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

const getModelImages = async (modelId) => {
    const result = await pool.query(
        "SELECT * FROM model_images WHERE model_id = $1 ORDER BY display_order ASC, created_at ASC",
        [modelId],
    );
    return result.rows;
};

const updateImageOrder = async (
    imageId,
    user,
    newDisplayOrder,
) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const result = await client.query(
            `SELECT m.user_id FROM model_images mi 
             JOIN models m ON mi.model_id = m.id 
             WHERE mi.id = $1`,
            [imageId],
        );

        if (result.rows.length === 0)
            throw new Error("Imagen no encontrada");

        checkPermission(result.rows[0].user_id, user);

        const updateResult = await client.query(
            "UPDATE model_images SET display_order = $1 WHERE id = $2 RETURNING *",
            [newDisplayOrder, imageId],
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

const deleteImage = async (imageId, user) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const result = await client.query(
            `SELECT mi.image_url, m.user_id FROM model_images mi 
             JOIN models m ON mi.model_id = m.id 
             WHERE mi.id = $1`,
            [imageId],
        );

        if (result.rows.length === 0)
            throw new Error("Imagen no encontrada");

        checkPermission(result.rows[0].user_id, user);

        await client.query(
            "DELETE FROM model_images WHERE id = $1",
            [imageId],
        );

        const absolutePath = path.join(
            process.cwd(),
            result.rows[0].image_url,
        );
        if (fs.existsSync(absolutePath)) {
            fs.unlinkSync(absolutePath);
        }

        await client.query("COMMIT");
        return {
            message: "Imagen eliminada correctamente",
        };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

export {
    addImage,
    getModelImages,
    updateImageOrder,
    deleteImage,
};
