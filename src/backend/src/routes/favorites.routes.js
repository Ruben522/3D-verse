import express from "express";
import {
    favorite,
    unfavorite,
    getMyFavorites,
    check,
    getUserFavoritesPublic,
} from "../controllers/favorites.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/me", verifyToken, getMyFavorites);
router.get("/user/:userId", getUserFavoritesPublic);
router.get("/:id/check", verifyToken, check);
router.post("/:id", verifyToken, favorite);
router.delete("/:id", verifyToken, unfavorite);

export default router;
