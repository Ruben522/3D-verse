import express from "express";
import {
    addToModel,
    removeFromModel,
    getAll,
    remove
} from "../controllers/tags.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getAll);

router.post("/model/:modelId", verifyToken, addToModel);
router.delete("/model/:modelId/:tagId", verifyToken, removeFromModel);
router.delete("/:tagId", verifyToken, remove);

export default router;