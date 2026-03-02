import express from "express";
import {
    addToModel,
    removeFromModel,
    getAll,
    remove,
    getForModel,
} from "../controllers/tags.controller.js";

import { verifyToken, isAdmin, isOwnerOrAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getAll);
router.post("/model/:modelId", verifyToken, isOwnerOrAdmin, addToModel);
router.delete("/model/:modelId/:tagId", verifyToken, isOwnerOrAdmin, removeFromModel);
router.delete("/:tagId", verifyToken, isOwnerOrAdmin, remove);
router.get("/model/:modelId", getForModel);

export default router;