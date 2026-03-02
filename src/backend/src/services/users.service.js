import pool from "../config/db.js";
import path from "path";
import fs from "fs";
import { checkPermission } from "../utils/checkPermission.js";

const getUserById = async (userId) => {
    const query = `
    SELECT 
      u.id, u.name, u.lastname, u.username, u.avatar,
      u.bio, u.youtube, u.twitter, u.linkedin, u.github,
      u.location, u.role, u.followers_count, u.following_count, u.created_at,
      (SELECT COUNT(*) FROM models m WHERE m.user_id = u.id) AS models_count
    FROM users u
    WHERE u.id = $1`;

    const result = await pool.query(query, [userId]);
    if (result.rows.length === 0) throw new Error("Usuario no encontrado");

    return result.rows[0];
};

const getUsers = async ({ page = 1, limit = 20 }) => {
    const safeLimit = Math.min(limit, 50);
    const offset = (page - 1) * safeLimit;

    const usersQuery = `
    SELECT id, name, lastname, username, avatar, bio, role, followers_count, following_count, created_at
    FROM users
    ORDER BY created_at DESC
    LIMIT $1 OFFSET $2`;

    const [usersResult, countResult] = await Promise.all([
        pool.query(usersQuery, [safeLimit, offset]),
        pool.query(`SELECT COUNT(*) FROM users`),
    ]);

    const total = parseInt(countResult.rows[0].count, 10);

    return {
        page,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
        data: usersResult.rows,
    };
};

const updateUser = async (userId, currentUser, data) => {
    checkPermission(userId, currentUser);

    const allowedFields = [
        "name", "lastname", "username", "avatar", "bio", 
        "youtube", "twitter", "linkedin", "github", "location"
    ];

    const fields = [];
    const values = [];
    let index = 1;

    for (const field of allowedFields) {
        if (data[field] !== undefined) {
            fields.push(`${field} = $${index++}`);
            values.push(data[field]);
        }
    }

    if (fields.length === 0) throw new Error("No hay campos para actualizar");

    const query = `
      UPDATE users
      SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${index}
      RETURNING id, name, lastname, username, avatar, role, created_at, updated_at`;

    values.push(userId);
    const result = await pool.query(query, values);
    return result.rows[0];
};

const deleteUser = async (userId, currentUser) => {
    checkPermission(userId, currentUser);

    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const folders = [
            path.join(process.cwd(), "uploads", "models", userId),
            path.join(process.cwd(), "uploads", "images", userId)
        ];

        folders.forEach(folder => {
            if (fs.existsSync(folder)) {
                fs.rmSync(folder, { recursive: true, force: true });
            }
        });

        await client.query("DELETE FROM users WHERE id = $1", [userId]);

        await client.query("COMMIT");
        return { message: "Usuario y todos sus archivos eliminados correctamente" };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

const getUserFavorites = async (userId) => {
    const result = await pool.query(`
    SELECT m.id, m.title, m.main_image_url, m.downloads, m.views, m.created_at
    FROM favorites f
    JOIN models m ON f.model_id = m.id
    WHERE f.user_id = $1
    ORDER BY f.created_at DESC`, [userId]);
    return result.rows;
};

export { getUserFavorites, getUsers, updateUser, deleteUser, getUserById };