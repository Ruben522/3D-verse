import pool from "../config/db.js";
import { hashPassword, comparePassword } from "../utils/hashPassword.js";
import { generateToken } from "../utils/generateToken.js";

export const registerUser = async ({ name, lastname, username, email, password }) => {
  const client = await pool.connect();

  try {
    const existingUser = await client.query(
      "SELECT id FROM users WHERE email = $1 OR username = $2",
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      throw new Error("Usuario o email ya existe");
    }

    const hashed = await hashPassword(password);

    const result = await client.query(
      `INSERT INTO users (name, lastname, username, email, role, password_hash)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, username, email, role`,
      [name, lastname, username, email, "user", hashed]
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


export const loginUser = async ({ email, password }) => {
  const client = await pool.connect();

  try {
    const result = await client.query(
      "SELECT * FROM users WHERE email = $1",
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

  } finally {
    client.release();
  }
};