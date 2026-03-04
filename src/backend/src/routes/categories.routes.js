import { Router } from "express";
import {
    create,
    getAll,
    getOne,
    getByModel,
    update,
    remove
} from "../controllers/categories.controller.js";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Rutas GET (Públicas)
router.get("/", getAll);
router.get("/model/:modelId", getByModel);
router.get("/:id", getOne);

router.post("/", verifyToken, create);
router.put("/:id", verifyToken, update);
router.delete("/:id", verifyToken, remove);

export default router;