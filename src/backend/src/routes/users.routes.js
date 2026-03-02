import express from "express";
import {
  getAll,
  update,
  remove,
  getFavorites,
  getById,
} from "../controllers/users.controller.js";
import { verifyToken, isAdmin, isOwnerOrAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", isAdmin, getAll);
router.get("/:id/favorites", getFavorites);
router.get("/:id", verifyToken, isOwnerOrAdmin, getById);
router.put("/:id", verifyToken, isOwnerOrAdmin, update);
router.delete("/:id", verifyToken, isOwnerOrAdmin, remove);

export default router;