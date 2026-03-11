import express from "express";
import {
    create,
    getAll,
    getByModel,
    remove,
} from "../controllers/modelParts.controller.js";
import {
    verifyToken,
    isAdmin,
} from "../middlewares/auth.middleware.js";
import { handleMultiplePartsUpload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post(
    "/:modelId",
    verifyToken,
    handleMultiplePartsUpload,
    create,
);
router.get("/", verifyToken, isAdmin, getAll);
router.get("/model/:modelId", getByModel);
router.delete("/:id", verifyToken, remove);

export default router;
