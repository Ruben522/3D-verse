import {
  getUserFavorites,
  getUsers,
  updateUser,
  deleteUser,
  getUserById,
} from "../services/users.service.js";

const getFavorites = async (req, res) => {
  try {
    const favorites = await getUserFavorites(req.params.id);
    res.status(200).json(favorites);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const users = await getUsers({ page, limit });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "No autenticado" });
    }

    const user = await updateUser(req.params.id, req.user, req.body);

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "No autenticado" });
    }

    const result = await deleteUser(req.params.id, req.user);

    res.status(200).json(result);
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export { getFavorites, getAll, update, remove, getById };
