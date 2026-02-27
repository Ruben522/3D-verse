import express from "express";
import {
    favorite,
    unfavorite,
    getMyFavorites,
    check,
} from "../controllers/favorites.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/:id", verifyToken, favorite);
router.delete("/:id", verifyToken, unfavorite);
router.get("/me", verifyToken, getMyFavorites);
router.get("/:id/check", verifyToken, check);

export default router;
