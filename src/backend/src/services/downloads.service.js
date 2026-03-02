import pool from "../config/db.js";
import { me } from "../controllers/auth.controller.js";

const recordDownload = async (modelId, user, ip, userAgent) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const modelResult = await client.query(
            "SELECT id FROM models WHERE id = $1",
            [modelId]
        );

        if (modelResult.rows.length === 0) {
            throw new Error("Modelo no encontrado");
        }

        await client.query(
            `INSERT INTO downloads (user_id, model_id, ip_address, user_agent)
             VALUES ($1, $2, $3, $4)`,
            [user ? user.id : null, modelId, ip, userAgent]
        );

        const updateResult = await client.query(
            `UPDATE models
             SET downloads = downloads + 1
             WHERE id = $1
             RETURNING file_url, downloads`,
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

const getDownloadsHistory = async (userId, { page = 1, limit = 20 }) => {
    const safeLimit = Math.min(limit, 50);
    const offset = (page - 1) * safeLimit;

    const query = `
        SELECT 
            d.id as download_id,
            d.created_at as download_date,
            m.id as model_id,
            m.title,
            m.main_image_url
        FROM downloads d
        JOIN models m ON d.model_id = m.id
        WHERE d.user_id = $1
        ORDER BY d.created_at DESC
        LIMIT $2 OFFSET $3
    `;

    const countQuery = `SELECT COUNT(*) FROM downloads WHERE user_id = $1`;

    const [downloadsResult, countResult] = await Promise.all([
        pool.query(query, [userId, safeLimit, offset]),
        pool.query(countQuery, [userId]),
    ]);

    const total = parseInt(countResult.rows[0].count, 10);

    if (total === 0) {
        return {
            message: "No se han registrado descargas",
        }
    };

    return {
        page,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
        data: downloadsResult.rows,
    };
};

const getModelDownloadStats = async (modelId, user) => {
    const client = await pool.connect();

    try {
        const modelCheck = await client.query(
            "SELECT user_id FROM models WHERE id = $1",
            [modelId]
        );

        if (modelCheck.rows.length === 0) {
            throw new Error("Modelo no encontrado");
        }

        const isOwner = modelCheck.rows[0].user_id === user.id;
        const isAdmin = user.role === "admin";

        if (!isOwner && !isAdmin) {
            throw new Error("No autorizado para ver estadísticas detalladas");
        }

        const query = `
            SELECT 
                COUNT(*) as total_downloads,
                COUNT(DISTINCT user_id) as unique_users,
                COUNT(user_id) as registered_downloads,
                SUM(CASE WHEN user_id IS NULL THEN 1 ELSE 0 END) as anonymous_downloads
            FROM downloads
            WHERE model_id = $1
        `;

        const result = await client.query(query, [modelId]);
        
        if (result.rows.length === 0) {
            return {
                message: "No se han registrado descargas en este modelo",
            }
        }

        return result.rows[0];
    } finally {
        client.release();
    }
};

export { recordDownload, getDownloadsHistory, getModelDownloadStats };