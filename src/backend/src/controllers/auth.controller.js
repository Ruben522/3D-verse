import { registerUser, loginUser } from "../services/auth.service.js";

export const register = async (req, res) => {
  try {
    const data = await registerUser(req.body);
    if (!data.email || !data.password || !data.username) {
    return res.status(400).json({ error: "Faltan datos obligatorios (email, password o username)" });
  }
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const data = await loginUser(req.body);
    res.status(200).json(data);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};