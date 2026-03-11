import { Router } from "express";
import { record, getUserHistory, getModelStats } from "../controllers/downloads.controller.js";
import { verifyToken, optionalToken } from "../middlewares/auth.middleware.js";

const router = Router();

// Rutas GET
router.get("/history", verifyToken, getUserHistory);
router.get("/stats/:modelId", verifyToken, getModelStats);

// Rutas POST
router.post("/:modelId", optionalToken, record);

export default router;