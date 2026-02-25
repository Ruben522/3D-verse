import { createModel, getModelById, getModels } from "../services/models.service.js";

const create = async (req, res) => {
  try {
    const model = await createModel(req.user.id, req.body);
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

export {
  create,
  getById,
  getAll
};