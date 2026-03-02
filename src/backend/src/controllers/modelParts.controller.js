import {
    createPart,
    getParts,
    getPartsByModelId,
    updatePart,
    deletePart,
} from "../services/modelParts.service.js";

const create = async (req, res) => {
    try {
        const part = await createPart(req.user.id, req.params.modelId, req.body);
        res.status(201).json({
            message: "Parte añadida correctamente",
            data: part,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAll = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const parts = await getParts({ page, limit });
        res.status(200).json(parts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getByModel = async (req, res) => {
    try {
        const parts = await getPartsByModelId(req.params.modelId);
        res.status(200).json(parts);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const part = await updatePart(req.params.id, req.user, req.body);
        res.status(200).json(part);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const result = await deletePart(req.params.id, req.user);
        res.status(200).json(result);
    } catch (error) {
        res.status(403).json({ error: error.message });
    }
};

export { create, getAll, getByModel, update, remove };