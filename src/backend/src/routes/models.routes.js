import express from "express";
import {
    create,
    getById,
    getAll,
    update,
    remove,
    download,
    favorite,
    unfavorite,
    like,
    unlike,
} from "../controllers/models.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", verifyToken, create);
router.get("/", getAll);
router.get("/:id", getById);
router.put("/:id", verifyToken, update);
router.delete("/:id", verifyToken, remove);
router.post("/:id/download", download);

router.post("/:id/favorite", verifyToken, favorite);
router.delete("/:id/favorite", verifyToken, unfavorite);
router.post("/:id/like", verifyToken, like);
router.delete("/:id/like", verifyToken, unlike);
export default router;
