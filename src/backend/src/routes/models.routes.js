import express from "express";
import { create, getById, getAll } from "../controllers/models.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", verifyToken, create);
router.get("/", getAll);
router.get("/:id", getById);

export default router;
