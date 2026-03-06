import express from "express";
import {
    create,
    getByModel,
    update,
    remove,
    reply,
} from "../controllers/comments.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/model/:modelId", getByModel);
router.post("/:modelId", verifyToken, create);
router.post("/:commentId/reply", verifyToken, reply);
router.put("/:commentId", verifyToken, update);
router.delete("/:commentId", verifyToken, remove);

export default router;
