import pool from "../config/db.js";
import { checkPermission } from "../utils/checkPermission.js";

const normalizeTag = (name) => {
  return name.trim().toLowerCase();
};

const createOrGetTag = async (client, name) => {
  const normalized = normalizeTag(name);
  const insertResult = await client.query(
    `INSERT INTO tags (name) VALUES ($1) ON CONFLICT (name) DO NOTHING RETURNING *`,
    [normalized]
  );

  if (insertResult.rows.length > 0) return insertResult.rows[0];

  const existing = await client.query("SELECT * FROM tags WHERE name = $1", [normalized]);
  return existing.rows[0];
};

const getTagsForModel = async (modelId) => {
  const result = await pool.query(
    `SELECT t.id, t.name FROM tags t JOIN model_tag mt ON t.id = mt.tag_id WHERE mt.model_id = $1 ORDER BY t.name ASC`,
    [modelId]
  );
  return result.rows;
};

const addTagToModel = async (modelId, user, tagName) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const modelResult = await client.query("SELECT user_id FROM models WHERE id = $1", [modelId]);
    if (modelResult.rows.length === 0) throw new Error("Modelo no encontrado");

    checkPermission(modelResult.rows[0].user_id, user);

    const tag = await createOrGetTag(client, tagName);
    await client.query(
      `INSERT INTO model_tag (model_id, tag_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`,
      [modelId, tag.id]
    );

    await client.query("COMMIT");
    return { message: "Tag añadido correctamente", tag };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const removeTagFromModel = async (modelId, tagId, user) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const modelResult = await client.query("SELECT user_id FROM models WHERE id = $1", [modelId]);
    if (modelResult.rows.length === 0) throw new Error("Modelo no encontrado");

    checkPermission(modelResult.rows[0].user_id, user);

    const deleteResult = await client.query(
      `DELETE FROM model_tag WHERE model_id = $1 AND tag_id = $2`,
      [modelId, tagId]
    );

    await client.query("COMMIT");
    return deleteResult.rowCount > 0 
      ? { message: "Tag eliminado del modelo" } 
      : { message: "El tag no existía en el modelo" };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const removeTag = async (tagId, user) => {
    if (user.role !== 'admin') throw new Error("Acción permitida solo para administradores");

    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const deleteResult = await client.query("DELETE FROM tags WHERE id = $1 RETURNING *", [tagId]);
        if (deleteResult.rows.length === 0) throw new Error("Tag no encontrado");
        await client.query("COMMIT");
        return { message: "Tag eliminado del sistema" };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

const getAllTags = async () => {
  const result = await pool.query(`SELECT id, name FROM tags ORDER BY name ASC`);
  return result.rows;
};

export { addTagToModel, removeTagFromModel, removeTag, getAllTags, getTagsForModel };