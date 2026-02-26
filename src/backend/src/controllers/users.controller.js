import { getUserFavorites } from "../services/users.service.js";

const getFavorites = async (req, res) => {
    try {
        const favorites = await getUserFavorites(
            req.params.id,
        );
        res.status(200).json(favorites);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export { getFavorites };
