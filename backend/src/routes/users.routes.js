import express from "express";
import {
    getAllPublicUsers,
    getAll,
    getById,
    getFavorites,
    update,
    remove,
    getLikes,
    getByUsername,
} from "../controllers/users.controller.js";
import {
    verifyToken,
    isAdmin,
    isOwnerOrAdmin,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/public", getAllPublicUsers);
router.get("/:id", getById);
router.get("/perfil/:username", getByUsername);
router.get("/:id/favorites", getFavorites);
router.get("/:userId/likes", verifyToken, getLikes);

router.get("/", verifyToken, isAdmin, getAll);
router.put("/:id", verifyToken, isOwnerOrAdmin, update);
router.delete("/:id", verifyToken, isOwnerOrAdmin, remove);

export default router;
