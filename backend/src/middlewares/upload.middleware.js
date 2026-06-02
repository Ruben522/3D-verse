import multer from "multer";
import path from "path";
import { cloudinary } from "../config/cloudinary.js";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const multerStoragePkg = require("multer-storage-cloudinary");

const CloudinaryStorage = multerStoragePkg.CloudinaryStorage || (multerStoragePkg.default && multerStoragePkg.default.CloudinaryStorage) || multerStoragePkg;

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const isImage = file.mimetype.startsWith("image/");
        const userId = req.user?.id || "guest";
        const cleanName = file.originalname.split(".")[0].replace(/\s/g, "_");
        const randomStr = Math.floor(Math.random() * 100000);

        return {
            folder: `3dverse/models/${userId}`,
            resource_type: "auto",
            public_id: `${Date.now()}_${randomStr}_${cleanName}`,
        };
    },
});

const createFilter = (allowedTypes, errorMsg) => (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) cb(null, true);
    else cb(new Error(errorMsg));
};

const filterAll = createFilter([".stl", ".glb", ".obj", ".png", ".jpg", ".jpeg"], "Solo archivos 3D o imágenes");
const filterImages = createFilter([".png", ".jpg", ".jpeg"], "Solo imágenes");
const filter3D = createFilter([".stl", ".glb", ".obj"], "Solo archivos 3D");

// 🔥 ARREGLO: Declaramos los límites y las variables UNA SOLA VEZ
const MAX_SIZE = 90 * 1024 * 1024; // 90 MB

const uploadModelFile = multer({ storage: storage, fileFilter: filterAll, limits: { fileSize: MAX_SIZE } });
const uploadImageFile = multer({ storage: storage, fileFilter: filterImages, limits: { fileSize: MAX_SIZE } });
const uploadPartsFile = multer({ storage: storage, fileFilter: filter3D, limits: { fileSize: MAX_SIZE } });
const uploadMainImageFile = multer({ storage: storage, fileFilter: filterImages, limits: { fileSize: MAX_SIZE } });
const uploadMainFileReplacement = multer({ storage: storage, fileFilter: filter3D, limits: { fileSize: MAX_SIZE } });

// Una vez declaradas, ya podemos usarlas
const rawModelUploadFields = uploadModelFile.fields([
    { name: "main_file", maxCount: 1 },
    { name: "cover_image", maxCount: 1 },
    { name: "parts", maxCount: 10 },
    { name: "gallery", maxCount: 10 },
]);

const modelUploadFields = (req, res, next) => {
    rawModelUploadFields(req, res, (err) => {
        if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ error: "Has superado el límite de 90MB por subida." });
        }
        if (err) {
            console.error("❌ ERROR OCULTO DE MULTER/CLOUDINARY:", err);
            return res.status(400).json({ error: "Error en la subida: " + err.message });
        }
        next();
    });
};

const createUploadWrapper = (uploadFn, limitErrorMsg) => (req, res, next) => {
    uploadFn(req, res, (err) => {
        if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ error: "El archivo excede el tamaño máximo permitido de 90MB." });
        }
        if (err instanceof multer.MulterError && err.code === "LIMIT_UNEXPECTED_FILE" && limitErrorMsg) {
            return res.status(400).json({ error: limitErrorMsg });
        }
        if (err) return res.status(400).json({ error: err.message });
        next();
    });
};

const handleMultipleImagesUpload = createUploadWrapper(uploadImageFile.array("images", 10));
const handleMultiplePartsUpload = createUploadWrapper(uploadPartsFile.array("parts", 10));
const handleMainImageReplacement = createUploadWrapper(uploadMainImageFile.single("image"), "Solo 1 imagen.");
const handleMainFileReplacement = createUploadWrapper(uploadMainFileReplacement.single("main_file"), "Solo 1 archivo 3D.");

export {
    uploadModelFile, modelUploadFields, uploadImageFile, uploadPartsFile,
    uploadMainImageFile, uploadMainFileReplacement, handleMultipleImagesUpload,
    handleMultiplePartsUpload, handleMainImageReplacement, handleMainFileReplacement,
};