import { Router } from "express";
import {
    create,
    getById,
    getAll,
    update,
    remove,
    like,
    unlike,
    uploadModel,
} from "../controllers/models.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js"; // Verifica el nombre de tu middleware auth
import { modelUploadFields } from "../middlewares/upload.middleware.js"; // Verifica el nombre de tu exportación multer

const router = Router();

// Rutas Públicas
router.get("/", getAll);
router.get("/:id", getById);

// ----------------------------------------------------------------
// FLUJO DE 2 PASOS (Protegido con Token)
// ----------------------------------------------------------------

// PASO 1: Recibe form-data, sube archivos, devuelve JSON con URLs
router.post(
    "/upload",
    verifyToken,
    modelUploadFields,
    uploadModel,
);

// PASO 2: Recibe raw JSON (con las URLs del Paso 1) y crea en BD
router.post("/", verifyToken, create);

// ----------------------------------------------------------------

// Modificar / Eliminar / Likes
router.put("/:id", verifyToken, update);
router.delete("/:id", verifyToken, remove);
router.post("/:id/like", verifyToken, like);
router.delete("/:id/like", verifyToken, unlike);

export default router;
