import { Router } from "express";
import {
    create,
    getAll,
    getOne,
    getByModel,
    update,
    remove,
    addToModel,
    removeFromModel,
} from "../controllers/categories.controller.js";
import {
    verifyToken,
    isAdmin,
} from "../middlewares/auth.middleware.js";

const router = Router();

// Rutas GET (Públicas)
router.get("/", getAll);
router.get("/model/:modelId", getByModel);
router.get("/:id", getOne);

router.post("/", verifyToken, isAdmin, create);
router.put("/:id", verifyToken, isAdmin, update);
router.delete("/:id", verifyToken, isAdmin, remove);
router.post(
    "/:modelId/categories",
    verifyToken,
    addToModel,
);
router.delete(
    "/:modelId/categories/:categoryId",
    verifyToken,
    removeFromModel,
);
export default router;
