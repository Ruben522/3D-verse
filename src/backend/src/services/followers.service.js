import pool from "../config/db.js";

const followUser = async (userIdToFollow, followerId) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        if (userIdToFollow === followerId) throw new Error("No puedes seguirte a ti mismo");

        const insertResult = await client.query(
            `INSERT INTO followers (user_id, follower_id)
             VALUES ($1,$2)
             ON CONFLICT DO NOTHING
             RETURNING *`,
            [userIdToFollow, followerId]
        );

        if (insertResult.rows.length === 0) {
            await client.query("ROLLBACK");
            return { message: "Ya sigues a este usuario" };
        }

        await client.query(
            "UPDATE users SET followers_count = followers_count + 1 WHERE id = $1",
            [userIdToFollow]
        );
        await client.query(
            "UPDATE users SET following_count = following_count + 1 WHERE id = $1",
            [followerId]
        );

        await client.query("COMMIT");
        return { message: "Ahora sigues a este usuario" };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

const unfollowUser = async (userIdToUnfollow, followerId) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const deleteResult = await client.query(
            "DELETE FROM followers WHERE user_id = $1 AND follower_id = $2 RETURNING *",
            [userIdToUnfollow, followerId]
        );

        if (deleteResult.rows.length === 0) {
            await client.query("ROLLBACK");
            return { message: "No seguías a este usuario" };
        }

        await client.query(
            "UPDATE users SET followers_count = GREATEST(followers_count - 1, 0) WHERE id = $1",
            [userIdToUnfollow]
        );
        await client.query(
            "UPDATE users SET following_count = GREATEST(following_count - 1, 0) WHERE id = $1",
            [followerId]
        );

        await client.query("COMMIT");
        return { message: "Has dejado de seguir al usuario" };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

const getFollowers = async (userId, { page = 1, limit = 20 }) => {
    const safeLimit = Math.min(limit, 50);
    const offset = (page - 1) * safeLimit;

    const query = `
        SELECT u.id, u.username, u.avatar, u.bio, f.followed_at
        FROM followers f
        JOIN users u ON f.follower_id = u.id
        WHERE f.user_id = $1
        ORDER BY f.followed_at DESC LIMIT $2 OFFSET $3`;

    const [result, countResult] = await Promise.all([
        pool.query(query, [userId, safeLimit, offset]),
        pool.query("SELECT COUNT(*) FROM followers WHERE user_id = $1", [userId])
    ]);

    return {
        page,
        limit: safeLimit,
        total: parseInt(countResult.rows[0].count, 10),
        data: result.rows
    };
};

const getFollowing = async (userId, { page = 1, limit = 20 }) => {
    const safeLimit = Math.min(limit, 50);
    const offset = (page - 1) * safeLimit;

    const query = `
        SELECT u.id, u.username, u.avatar, u.bio, f.followed_at
        FROM followers f
        JOIN users u ON f.user_id = u.id
        WHERE f.follower_id = $1
        ORDER BY f.followed_at DESC LIMIT $2 OFFSET $3`;

    const [result, countResult] = await Promise.all([
        pool.query(query, [userId, safeLimit, offset]),
        pool.query("SELECT COUNT(*) FROM followers WHERE follower_id = $1", [userId])
    ]);

    return {
        page,
        limit: safeLimit,
        total: parseInt(countResult.rows[0].count, 10),
        data: result.rows
    };
};

const checkFollow = async (userIdToCheck, followerId) => {
    const result = await pool.query(
        "SELECT 1 FROM followers WHERE user_id = $1 AND follower_id = $2",
        [userIdToCheck, followerId]
    );
    return { isFollowing: result.rows.length > 0 };
};

export { followUser, unfollowUser, getFollowers, getFollowing, checkFollow };