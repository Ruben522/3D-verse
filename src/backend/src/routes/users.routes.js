import express from "express";
import {
  getAll,
  update,
  remove,
  getFavorites,
  getById,
} from "../controllers/users.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getAll);
router.get("/:id/favorites", getFavorites);
router.get("/:id", getById);
router.put("/:id", verifyToken, update);
router.delete("/:id", verifyToken, remove);

export default router;