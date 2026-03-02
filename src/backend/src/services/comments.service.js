import pool from "../config/db.js";
import { checkPermission } from "../utils/checkPermission.js";

const createComment = async (modelId, userId, content) => {
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

        const insertResult = await client.query(
            `INSERT INTO comments (user_id, model_id, content)
             VALUES ($1,$2,$3)
             RETURNING id, user_id, model_id, content, created_at, updated_at`,
            [userId, modelId, content]
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

const getModelComments = async (modelId, { page = 1, limit = 20 }) => {
    const safeLimit = Math.min(limit, 50);
    const offset = (page - 1) * safeLimit;

    const commentsQuery = `
        SELECT 
            c.id, c.content, c.created_at, c.updated_at,
            json_build_object('id', u.id, 'username', u.username, 'avatar', u.avatar) AS author
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.model_id = $1
        ORDER BY c.created_at DESC
        LIMIT $2 OFFSET $3
    `;

    const countQuery = `SELECT COUNT(*) FROM comments WHERE model_id = $1`;

    const [commentsResult, countResult] = await Promise.all([
        pool.query(commentsQuery, [modelId, safeLimit, offset]),
        pool.query(countQuery, [modelId])
    ]);

    const total = parseInt(countResult.rows[0].count, 10);

    return {
        page,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
        data: commentsResult.rows
    };
};

const updateComment = async (commentId, user, content) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            "SELECT user_id FROM comments WHERE id = $1",
            [commentId]
        );

        if (result.rows.length === 0) throw new Error("Comentario no encontrado");

        // VALIDACIÓN CENTRALIZADA
        checkPermission(result.rows[0].user_id, user);

        const updateResult = await client.query(
            `UPDATE comments
             SET content = $1, updated_at = CURRENT_TIMESTAMP
             WHERE id = $2
             RETURNING id, content, created_at, updated_at`,
            [content, commentId]
        );

        return updateResult.rows[0];
    } finally {
        client.release();
    }
};

const deleteComment = async (commentId, user) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            "SELECT user_id FROM comments WHERE id = $1",
            [commentId]
        );

        if (result.rows.length === 0) throw new Error("Comentario no encontrado");

        // VALIDACIÓN CENTRALIZADA
        checkPermission(result.rows[0].user_id, user);

        await client.query("DELETE FROM comments WHERE id = $1", [commentId]);

        return { message: "Comentario eliminado correctamente" };
    } finally {
        client.release();
    }
};

export {
    createComment,
    getModelComments,
    updateComment,
    deleteComment
};