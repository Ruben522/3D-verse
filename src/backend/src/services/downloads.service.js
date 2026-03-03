import pool from "../config/db.js";
import path from "path";
import fs from "fs";
import { checkPermission } from "../utils/checkPermission.js";

const recordDownload = async (
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

        if (modelResult.rows.length === 0)
            throw new Error("Modelo no encontrado");

        // Insertamos el registro de descarga (user puede ser null si es anónimo)
        await client.query(
            `INSERT INTO downloads (user_id, model_id, ip_address, user_agent)
             VALUES ($1, $2, $3, $4)`,
            [user ? user.id : null, modelId, ip, userAgent],
        );

        // Actualizamos el contador global en la tabla de modelos
        const updateResult = await client.query(
            `UPDATE models SET downloads = downloads + 1 WHERE id = $1
             RETURNING file_url, downloads`,
            [modelId],
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

const getDownloadsHistory = async (
    userId,
    { page = 1, limit = 20 },
) => {
    const safeLimit = Math.min(limit, 50);
    const offset = (page - 1) * safeLimit;

    const query = `
        SELECT d.id as download_id, d.created_at as download_date,
               m.id as model_id, m.title, m.main_image_url
        FROM downloads d
        JOIN models m ON d.model_id = m.id
        WHERE d.user_id = $1
        ORDER BY d.created_at DESC LIMIT $2 OFFSET $3`;

    const [downloadsResult, countResult] =
        await Promise.all([
            pool.query(query, [userId, safeLimit, offset]),
            pool.query(
                "SELECT COUNT(*) FROM downloads WHERE user_id = $1",
                [userId],
            ),
        ]);

    const total = parseInt(countResult.rows[0].count, 10);

    // Mantenemos la estructura consistente para el Frontend
    return {
        page,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
        data: downloadsResult.rows, // Si está vacío, devuelve []
    };
};

const getModelDownloadStats = async (modelId, user) => {
    const client = await pool.connect();
    try {
        const modelCheck = await client.query(
            "SELECT user_id FROM models WHERE id = $1",
            [modelId],
        );

        if (modelCheck.rows.length === 0)
            throw new Error("Modelo no encontrado");

        // VALIDACIÓN CENTRALIZADA: Solo el dueño o admin ven estadísticas
        checkPermission(modelCheck.rows[0].user_id, user);

        const query = `
            SELECT 
                COUNT(*) as total_downloads,
                COUNT(DISTINCT user_id) as unique_users,
                COUNT(user_id) filter (where user_id is not null) as registered_downloads,
                COUNT(*) filter (where user_id is null) as anonymous_downloads
            FROM downloads
            WHERE model_id = $1`;

        const result = await client.query(query, [modelId]);
        return result.rows[0];
    } finally {
        client.release();
    }
};

const getDownloadInfo = async (modelId) => {
    const result = await pool.query(
        "SELECT title, file_url FROM models WHERE id = $1",
        [modelId],
    );

    if (result.rows.length === 0)
        throw new Error("Modelo no encontrado");

    const model = result.rows[0];

    // 1. Normalizamos la ruta: quitamos la "/" inicial y ajustamos a barras de Windows (\)
    const relativePath = path.normalize(
        model.file_url.startsWith("/")
            ? model.file_url.slice(1)
            : model.file_url,
    );

    // 2. Construimos la ruta absoluta desde la raíz del proyecto
    const absolutePath = path.resolve(
        process.cwd(),
        relativePath,
    );

    // LOG DE CONTROL: Mira tu terminal, esta ruta debe ser IDÉNTICA a la de tu carpeta
    console.log("Ruta final de búsqueda:", absolutePath);

    if (!fs.existsSync(absolutePath)) {
        throw new Error(
            `El archivo físico no existe en: ${absolutePath}`,
        );
    }

    const extension = path.extname(model.file_url);
    const cleanName = `${model.title.replace(/\s/g, "_")}${extension}`;

    return {
        absolutePath,
        cleanName,
        modelFolder: path.dirname(absolutePath),
    };
};

export {
    recordDownload,
    getDownloadsHistory,
    getModelDownloadStats,
    getDownloadInfo,
};
