import {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    checkFollow
} from "../services/followers.service.js";

const follow = async (req, res) => {
    try {
        const result = await followUser(
            req.params.userId,
            req.user.id
        );

        res.status(200).json(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const unfollow = async (req, res) => {
    try {
        const result = await unfollowUser(
            req.params.userId,
            req.user.id
        );

        res.status(200).json(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const followers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const result = await getFollowers(
            req.params.userId,
            { page, limit }
        );

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const following = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const result = await getFollowing(
            req.params.userId,
            { page, limit }
        );

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const check = async (req, res) => {
    try {
        const result = await checkFollow(
            req.params.userId,
            req.user.id
        );

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export {
    follow,
    unfollow,
    followers,
    following,
    check
};