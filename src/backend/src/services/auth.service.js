import pool from "../config/db.js";
import { hashPassword, comparePassword } from "../utils/hashPassword.js";
import { generateToken } from "../utils/generateToken.js";

const registerUser = async ({ name, lastname, username, email, password }) => {
    const client = await pool.connect();
    try {
        const existingUser = await client.query(
            "SELECT id FROM users WHERE email = $1 OR username = $2",
            [email, username]
        );

        if (existingUser.rows.length > 0) {
            throw new Error("El nombre de usuario o el email ya están en uso");
        }

        const hashed = await hashPassword(password);

        const result = await client.query(
            `INSERT INTO users (name, lastname, username, email, role, password_hash)
             VALUES ($1, $2, $3, $4, 'user', $5)
             RETURNING id, username, email, role`,
            [name, lastname, username, email, hashed]
        );

        const user = result.rows[0];

        const token = generateToken({
            id: user.id,
            role: user.role,
        });

        return { user, token };
    } finally {
        client.release();
    }
};

const loginUser = async ({ email, password }) => {
    const result = await pool.query(
        "SELECT id, username, email, role, password_hash FROM users WHERE email = $1",
        [email]
    );

    if (result.rows.length === 0) {
        throw new Error("Credenciales inválidas");
    }

    const user = result.rows[0];

    const validPassword = await comparePassword(password, user.password_hash);

    if (!validPassword) {
        throw new Error("Credenciales inválidas");
    }

    const token = generateToken({
        id: user.id,
        role: user.role,
    });

    return {
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        },
        token,
    };
};

const getCurrentUser = async (userId) => {
    const result = await pool.query(
        `SELECT id, name, lastname, username, email, role, avatar, created_at
         FROM users WHERE id = $1`,
        [userId]
    );

    if (result.rows.length === 0) {
        throw new Error("Usuario no encontrado");
    }

    return result.rows[0];
};

export { registerUser, loginUser, getCurrentUser };