import {
    registerUser,
    loginUser,
    getCurrentUser,
} from "../services/auth.service.js";

const register = async (req, res) => {
    try {
        const data = await registerUser(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const data = await loginUser(req.body);
        res.status(200).json(data);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

const me = async (req, res) => {
    try {
        const user = await getCurrentUser(req.user.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

export { register, login, me };
