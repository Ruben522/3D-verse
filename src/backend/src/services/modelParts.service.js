import pool from "../config/db.js";
import fs from "fs";
import path from "path";
import { checkPermission } from "../utils/checkPermission.js";

const createPart = async (user, modelId, data) => {
    const { color, part_name, file_url, file_size } = data;
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
            `INSERT INTO model_parts (model_id, color, part_name, file_url, file_size)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [
                modelId,
                color || null,
                part_name,
                file_url,
                file_size,
            ],
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

const getParts = async ({ page = 1, limit = 20 }) => {
    const safeLimit = Math.min(limit, 50);
    const offset = (page - 1) * safeLimit;

    const [partsResult, countResult] = await Promise.all([
        pool.query(
            `SELECT * FROM model_parts ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
            [safeLimit, offset],
        ),
        pool.query(`SELECT COUNT(*) FROM model_parts`),
    ]);

    return {
        page,
        limit: safeLimit,
        total: parseInt(countResult.rows[0].count, 10),
        data: partsResult.rows,
    };
};

const getPartsByModelId = async (modelId) => {
    const result = await pool.query(
        "SELECT * FROM model_parts WHERE model_id = $1 ORDER BY created_at ASC",
        [modelId],
    );
    return result.rows;
};

const deletePart = async (partId, user) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const result = await client.query(
            `SELECT mp.file_url, m.user_id FROM model_parts mp 
             JOIN models m ON mp.model_id = m.id WHERE mp.id = $1`,
            [partId],
        );

        if (result.rows.length === 0)
            throw new Error("Parte no encontrada");

        checkPermission(result.rows[0].user_id, user);

        const fileUrl = result.rows[0].file_url;

        await client.query(
            "DELETE FROM model_parts WHERE id = $1",
            [partId],
        );

        const relativePath = path.normalize(
            fileUrl.startsWith("/")
                ? fileUrl.slice(1)
                : fileUrl,
        );
        const absolutePath = path.resolve(
            process.cwd(),
            relativePath,
        );

        try {
            if (fs.existsSync(absolutePath)) {
                fs.unlinkSync(absolutePath);
                console.log(
                    "-> Pieza eliminada físicamente:",
                    absolutePath,
                );
            }
        } catch (fsError) {
            console.error(
                "-> Error al borrar pieza física:",
                fsError,
            );
        }

        await client.query("COMMIT");
        return { message: "Parte eliminada correctamente" };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

export {
    createPart,
    getParts,
    getPartsByModelId,
    deletePart,
};
