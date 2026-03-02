import pool from "../config/db.js";

const normalizeTag = (name) => {
  return name.trim().toLowerCase();
};

const createOrGetTag = async (client, name) => {
  const normalized = normalizeTag(name);

  const insertResult = await client.query(
    `INSERT INTO tags (name)
         VALUES ($1)
         ON CONFLICT (name) DO NOTHING
         RETURNING *`,
    [normalized],
  );

  if (insertResult.rows.length > 0) {
    return insertResult.rows[0];
  }

  const existing = await client.query("SELECT * FROM tags WHERE name = $1", [
    normalized,
  ]);

  return existing.rows[0];
};

const getTagsForModel = async (modelId) => {
  const result = await pool.query(
    `SELECT t.id, t.name
         FROM tags t
         JOIN model_tag mt ON t.id = mt.tag_id
         WHERE mt.model_id = $1
         ORDER BY t.name ASC`,
    [modelId],
  );

  if (result.rows.length === 0) {
    throw new Error("No se encontraron tags para este modelo");
  }

  return result.rows;
};

const addTagToModel = async (modelId, user, tagName) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const modelResult = await client.query(
      "SELECT user_id FROM models WHERE id = $1",
      [modelId],
    );

    if (modelResult.rows.length === 0) {
      throw new Error("Modelo no encontrado");
    }

    const model = modelResult.rows[0];
    const roleResult = await client.query(
      "SELECT role FROM users WHERE id = $1",
      [user.id],
    );

    const actualRole =
      roleResult.rows.length > 0 ? roleResult.rows[0].role : null;

    const isOwner = model.user_id === user.id;
    const isAdmin = actualRole === "admin";

    if (!isOwner && !isAdmin) {
      throw new Error("No autorizado");
    }

    const tag = await createOrGetTag(client, tagName);

    await client.query(
      `INSERT INTO model_tag (model_id, tag_id)
             VALUES ($1,$2)
             ON CONFLICT DO NOTHING`,
      [modelId, tag.id],
    );

    await client.query("COMMIT");

    return { message: "Tag añadido correctamente" };
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

    const modelResult = await client.query(
      "SELECT user_id FROM models WHERE id = $1",
      [modelId],
    );

    if (modelResult.rows.length === 0) {
      throw new Error("Modelo no encontrado");
    }

    const model = modelResult.rows[0];

    const roleResult = await client.query(
      "SELECT role FROM users WHERE id = $1",
      [user.id],
    );

    const actualRole =
      roleResult.rows.length > 0 ? roleResult.rows[0].role : null;

    const isOwner = model.user_id === user.id;
    const isAdmin = actualRole === "admin";

    if (!isOwner && !isAdmin) {
      throw new Error("No autorizado");
    }

    await client.query(
      `DELETE FROM model_tag
             WHERE model_id = $1 AND tag_id = $2`,
      [modelId, tagId],
    );

    await client.query("COMMIT");

    if (client.rowCount > 0) {
      return { message: "Tag eliminado del modelo" };
    } else {
      return { message: "El tag no existía en el modelo" };
    }
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const removeTag = async (tagId, user) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const deleteResult = await client.query(
            "DELETE FROM tags WHERE id = $1 RETURNING *",
            [tagId]
        );

        if (deleteResult.rows.length === 0) {
            throw new Error("Tag no encontrado");
        }

        await client.query("COMMIT");

        return { message: "Tag eliminado completamente" };

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

const getAllTags = async () => {
  const result = await pool.query(
    `SELECT id, name
         FROM tags
         ORDER BY name ASC`,
  );

  return result.rows;
};

export { addTagToModel, removeTagFromModel, removeTag, getAllTags, getTagsForModel };
