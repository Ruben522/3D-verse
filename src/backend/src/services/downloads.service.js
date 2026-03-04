import pool from "../config/db.js";
import fs from "fs";
import path from "path";
import { checkPermission } from "../utils/checkPermission.js";
import { getAbsolutePath } from "../utils/helper/file.helper.js";

/**
 * Registra una descarga en el historial y actualiza el contador global del modelo.
 */
const recordDownload = async (modelId, user, ip, userAgent) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const modelResult = await client.query("SELECT id FROM models WHERE id = $1", [modelId]);
        if (modelResult.rows.length === 0) throw new Error("Modelo no encontrado");

        await client.query(
            `INSERT INTO downloads (user_id, model_id, ip_address, user_agent) VALUES ($1, $2, $3, $4)`,
            [user ? user.id : null, modelId, ip, userAgent]
        );

        const updateResult = await client.query(
            `UPDATE models SET downloads = downloads + 1 WHERE id = $1 RETURNING file_url, downloads`,
            [modelId]
        );

        await client.query("COMMIT");

        return {
            message: "Descarga registrada correctamente",
            downloads_count: updateResult.rows[0].downloads,
            file_url: updateResult.rows[0].file_url,
        };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

/**
 * Obtiene el historial paginado de descargas de un usuario.
 */
const getDownloadsHistory = async (userId, { page = 1, limit = 20 }) => {
    const safeLimit = Math.min(limit, 50);
    const offset = (page - 1) * safeLimit;

    const query = `
        SELECT d.id as download_id, d.created_at as download_date, m.id as model_id, m.title, m.main_image_url
        FROM downloads d JOIN models m ON d.model_id = m.id
        WHERE d.user_id = $1 ORDER BY d.created_at DESC LIMIT $2 OFFSET $3`;

    const [downloadsResult, countResult] = await Promise.all([
        pool.query(query, [userId, safeLimit, offset]),
        pool.query("SELECT COUNT(*) FROM downloads WHERE user_id = $1", [userId]),
    ]);

    const total = parseInt(countResult.rows[0].count, 10);

    return {
        page, limit: safeLimit, total, totalPages: Math.ceil(total / safeLimit), data: downloadsResult.rows,
    };
};

/**
 * Obtiene las estadísticas de descargas de un modelo (solo para el creador).
 */
const getModelDownloadStats = async (modelId, user) => {
    const client = await pool.connect();
    try {
        const modelCheck = await client.query("SELECT user_id FROM models WHERE id = $1", [modelId]);
        if (modelCheck.rows.length === 0) throw new Error("Modelo no encontrado");

        checkPermission(modelCheck.rows[0].user_id, user);

        const query = `
            SELECT COUNT(*) as total_downloads, COUNT(DISTINCT user_id) as unique_users,
                   COUNT(user_id) filter (where user_id is not null) as registered_downloads,
                   COUNT(*) filter (where user_id is null) as anonymous_downloads
            FROM downloads WHERE model_id = $1`;

        const result = await client.query(query, [modelId]);
        return result.rows[0];
    } finally {
        client.release();
    }
};

/**
 * Obtiene las rutas físicas absolutas para procesar la descarga.
 */
const getDownloadInfo = async (modelId) => {
    const result = await pool.query("SELECT title, file_url FROM models WHERE id = $1", [modelId]);
    if (result.rows.length === 0) throw new Error("Modelo no encontrado");

    const model = result.rows[0];
    const absolutePath = getAbsolutePath(model.file_url);

    if (!absolutePath || !fs.existsSync(absolutePath)) {
        throw new Error(`El archivo físico no existe en el servidor.`);
    }

    const extension = path.extname(model.file_url);
    const cleanName = `${model.title.replace(/\s/g, "_")}${extension}`;

    return {
        absolutePath,
        cleanName,
        modelFolder: path.dirname(absolutePath),
    };
};

export { recordDownload, getDownloadsHistory, getModelDownloadStats, getDownloadInfo };