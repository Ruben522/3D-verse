import multer from "multer";
import path from "path";
import { cloudinary } from "../config/cloudinary.js";

// 🪄 MAGIA NEGRA: Extraemos la librería sin importar cómo venga empaquetada
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const multerStoragePkg = require("multer-storage-cloudinary");

// Buscamos el constructor en todas sus formas posibles (por si está escondido en .default)
const CloudinaryStorage = multerStoragePkg.CloudinaryStorage || (multerStoragePkg.default && multerStoragePkg.default.CloudinaryStorage) || multerStoragePkg;

// Ponemos un chivato para confirmar que lo ha encontrado
console.log("=== VERIFICANDO CONSTRUCTOR ===", typeof CloudinaryStorage);

/**
 * 1. CONFIGURACIÓN DEL STORAGE DE CLOUDINARY
 */
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const isImage = file.mimetype.startsWith("image/");
        const userId = req.user?.id || "guest";
        const cleanName = file.originalname.split(".")[0].replace(/\s/g, "_");

        return {
            folder: `3dverse/models/${userId}`,
            resource_type: "auto",
            public_id: `${Date.now()}_${cleanName}`,
        };
    },
});

/**
 * 2. FILTROS DE EXTENSIÓN
 */
const createFilter = (allowedTypes, errorMsg) => (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error(errorMsg));
    }
};

const filterAll = createFilter([".stl", ".glb", ".obj", ".png", ".jpg", ".jpeg"], "Solo archivos 3D o imágenes");
const filterImages = createFilter([".png", ".jpg", ".jpeg"], "Solo imágenes");
const filter3D = createFilter([".stl", ".glb", ".obj"], "Solo archivos 3D");

/**
 * 3. INSTANCIAS DE MULTER
 */
const uploadModelFile = multer({ storage: storage, fileFilter: filterAll });
const uploadImageFile = multer({ storage: storage, fileFilter: filterImages });
const uploadPartsFile = multer({ storage: storage, fileFilter: filter3D });
const uploadMainImageFile = multer({ storage: storage, fileFilter: filterImages });
const uploadMainFileReplacement = multer({ storage: storage, fileFilter: filter3D });

const modelUploadFields = uploadModelFile.fields([
    { name: "main_file", maxCount: 1 },
    { name: "cover_image", maxCount: 1 },
    { name: "parts", maxCount: 10 },
    { name: "gallery", maxCount: 10 },
]);

/**
 * 4. WRAPPERS DE ERRORES
 */
const createUploadWrapper = (uploadFn, limitErrorMsg) => (req, res, next) => {
    uploadFn(req, res, (err) => {
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
    uploadModelFile,
    modelUploadFields,
    uploadImageFile,
    uploadPartsFile,
    uploadMainImageFile,
    uploadMainFileReplacement,
    handleMultipleImagesUpload,
    handleMultiplePartsUpload,
    handleMainImageReplacement,
    handleMainFileReplacement,
};