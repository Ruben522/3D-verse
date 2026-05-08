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

router.get("/", getAll);
router.get("/user/:userId", getByUser);
router.get("/:id", getById);

router.post("/upload", verifyToken, modelUploadFields, uploadModel);
router.post("/", verifyToken, create);

router.put("/:id", verifyToken, update);
router.delete("/:id", verifyToken, remove);

router.post("/:id/like", verifyToken, like);
router.delete("/:id/like", verifyToken, unlike);

router.patch("/:id/main-image", verifyToken, handleMainImageReplacement, patchMainImage);
router.delete("/:id/main-image", verifyToken, removeMainImage);
router.patch("/:id/main-file", verifyToken, handleMainFileReplacement, patchMainFile);

export default router;