import {
    addFavorite,
    removeFavorite,
    getUserFavorites,
    checkFavorite,
} from "../services/favorites.service.js";

const favorite = async (req, res) => {
    try {
        const result = await addFavorite(
            req.params.id,
            req.user.id,
        );

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const unfavorite = async (req, res) => {
    try {
        const result = await removeFavorite(
            req.params.id,
            req.user.id,
        );

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getMyFavorites = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const result = await getUserFavorites(req.user.id, {
            page,
            limit,
        });

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const check = async (req, res) => {
    try {
        const result = await checkFavorite(
            req.params.id,
            req.user.id,
        );

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { favorite, unfavorite, getMyFavorites, check };
