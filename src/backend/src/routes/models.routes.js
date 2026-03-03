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
    patchMainImage,
    removeMainImage,
} from "../controllers/models.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
    modelUploadFields,
    uploadMainImageFile,
} from "../middlewares/upload.middleware.js";

const router = Router();

router.get("/", getAll);
router.get("/:id", getById);

router.post(
    "/upload",
    verifyToken,
    modelUploadFields,
    uploadModel,
);

router.post("/", verifyToken, create);

router.put("/:id", verifyToken, update);
router.delete("/:id", verifyToken, remove);
router.post("/:id/like", verifyToken, like);
router.delete("/:id/like", verifyToken, unlike);
router.patch(
    "/:id/main-image",
    verifyToken,
    uploadMainImageFile.single("image"),
    patchMainImage,
);
router.delete(
    "/:id/main-image",
    verifyToken,
    removeMainImage,
);
export default router;
