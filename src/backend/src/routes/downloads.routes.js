import express from "express";
import {
    record,
    getUserHistory,
    getModelStats,
} from "../controllers/downloads.controller.js";
import { verifyToken, optionalToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/:modelId", optionalToken, record);

router.get("/history", verifyToken, getUserHistory);
router.get("/stats/:modelId", verifyToken, getModelStats);

export default router;