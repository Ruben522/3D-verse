import express from "express";
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
import { verifyToken } from "../middlewares/auth.middleware.js";
import { modelUploadFields } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post("/", verifyToken, create);
router.get("/", getAll);
router.get("/:id", getById);
router.put("/:id", verifyToken, update);
router.delete("/:id", verifyToken, remove);
router.post("/:id/like", verifyToken, like);
router.delete("/:id/like", verifyToken, unlike);
router.post(
    "/upload/model",
    verifyToken,
    modelUploadFields,
    uploadModel,
);

export default router;
