import {
    createModel,
    getModelById,
    getModels,
} from "../services/models.service.js";

const create = async (req, res) => {
    try {
        const model = await createModel(
            req.user.id,
            req.body,
        );
        res.status(201).json(model);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getById = async (req, res) => {
    try {
        const model = await getModelById(req.params.id);
        res.status(200).json(model);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

const getAll = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const models = await getModels({ page, limit });

        res.status(200).json(models);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const model = await updateModel(
            req.params.id,
            req.user,
            req.body,
        );
        res.status(200).json(model);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const result = await deleteModel(
            req.params.id,
            req.user,
        );
        res.status(200).json(result);
    } catch (error) {
        res.status(403).json({ error: error.message });
    }
};

import { downloadModel } from "../services/models.service.js";

const download = async (req, res) => {
    try {
        const tokenUser = req.user || null;

        const ip = req.ip;
        const userAgent = req.headers["user-agent"];

        const result = await downloadModel(
            req.params.id,
            tokenUser,
            ip,
            userAgent,
        );

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const like = async (req, res) => {
    try {
        const result = await addLike(
            req.params.id,
            req.user.id,
        );
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const unlike = async (req, res) => {
    try {
        const result = await removeLike(
            req.params.id,
            req.user.id,
        );
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export {
    create,
    getById,
    getAll,
    update,
    remove,
    download,
    like,
    unlike,
};
