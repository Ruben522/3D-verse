import { Router } from "express";
import {
    uploadImage,
    getImages,
    updateOrder,
    removeImage,
} from "../controllers/modelsImages.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { handleMultipleImagesUpload } from "../middlewares/upload.middleware.js";

const router = Router();

router.get("/model/:modelId", getImages);

router.post(
    "/model/:modelId",
    verifyToken,
    handleMultipleImagesUpload,
    uploadImage,
);

router.patch("/:id/order", verifyToken, updateOrder);

router.delete("/:id", verifyToken, removeImage);

export default router;
