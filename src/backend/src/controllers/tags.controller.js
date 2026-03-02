import {
    addTagToModel,
    removeTagFromModel,
    getAllTags,
    removeTag,
    getTagsForModel,
} from "../services/tags.service.js";

const getForModel = async (req, res) => {
    try {
        const tags = await getTagsForModel(req.params.modelId);
        res.status(200).json(tags);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

const addToModel = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || name.trim() === "") {
            return res.status(400).json({ error: "Tag inválido" });
        }

        const result = await addTagToModel(
            req.params.modelId,
            req.user,
            name
        );

        res.status(200).json(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const removeFromModel = async (req, res) => {
    try {
        const result = await removeTagFromModel(
            req.params.modelId,
            req.params.tagId,
            req.user
        );

        res.status(200).json(result);

    } catch (error) {
        res.status(403).json({ error: error.message });
    }
};

const getAll = async (req, res) => {
    try {
        const tags = await getAllTags();
        res.status(200).json(tags);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const result = await removeTag(
            req.params.tagId,
            req.user
        );

        res.status(200).json(result);

    } catch (error) {
        res.status(403).json({ error: error.message });
    }
};

export {
    addToModel,
    removeFromModel,
    getAll,
    remove,
    getForModel,
};