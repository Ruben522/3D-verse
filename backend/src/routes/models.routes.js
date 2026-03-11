import { Router } from "express";
import {
    create,
    getById,
    getAll,
    getByUser,
    update,
    remove,
    like,
    unlike,
    uploadModel,
    patchMainImage,
    removeMainImage,
    patchMainFile,
} from "../controllers/models.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
    modelUploadFields,
    handleMainImageReplacement,
    handleMainFileReplacement,
} from "../middlewares/upload.middleware.js";

const router = Router();

// Rutas GET
router.get("/", getAll);
router.get("/user/:userId", getByUser); // Importante: Esto debe ir antes de /:id
router.get("/:id", getById);

// Rutas de creación (Upload primero, luego creación de DB)
router.post("/upload", verifyToken, modelUploadFields, uploadModel);
router.post("/", verifyToken, create);

// Rutas de modificación y borrado de modelo
router.put("/:id", verifyToken, update);
router.delete("/:id", verifyToken, remove);

// Rutas de interacción (Likes)
router.post("/:id/like", verifyToken, like);
router.delete("/:id/like", verifyToken, unlike);

// Rutas de reemplazo de archivos independientes
router.patch("/:id/main-image", verifyToken, handleMainImageReplacement, patchMainImage);
router.delete("/:id/main-image", verifyToken, removeMainImage);
router.patch("/:id/main-file", verifyToken, handleMainFileReplacement, patchMainFile);

export default router;