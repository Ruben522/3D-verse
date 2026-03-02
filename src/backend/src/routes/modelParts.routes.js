import express from "express";
import {
    create,
    getAll,
    getByModel,
    update,
    remove,
} from "../controllers/modelParts.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/:modelId", verifyToken, create);
router.get("/", verifyToken, getAll);
router.get("/model/:modelId", getByModel);
router.put("/:id", verifyToken, update);
router.delete("/:id", verifyToken, remove);

export default router;