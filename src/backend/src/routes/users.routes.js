import express from "express";
import { getFavorites } from "../controllers/users.controller.js";

const router = express.Router();

router.get("/:id/favorites", getFavorites);

export default router;
