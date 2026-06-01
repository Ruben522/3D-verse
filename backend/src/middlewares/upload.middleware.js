import multer from "multer";
import path from "path";
import pkg from "multer-storage-cloudinary";
const { CloudinaryStorage } = pkg;
import { cloudinary } from "../server/cloudinary.js";
/**
 * 1. CONFIGURACIÓN DEL STORAGE DE CLOUDINARY
 * Sustituye a tus antiguos createInitialStorage y createDynamicStorage.
 * Ya no necesitamos fs, ni buscar en la BD, Cloudinary hace la magia.
 */
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const isImage = file.mimetype.startsWith("image/");
        const userId = req.user?.id || "guest";

        const cleanName = file.originalname.split(".")[0].replace(/\s/g, "_");

        return {
            folder: `3dverse/models/${userId}`,
            resource_type: isImage ? "image" : "raw",
            public_id: `${Date.now()}_${cleanName}`,
        };
    },
});

/**
 * 2. FILTROS DE EXTENSIÓN (¡Mantenemos tu excelente lógica!)
 */
const createFilter = (allowedTypes, errorMsg) => (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error(errorMsg));
    }
};

const filterAll = createFilter(
    [".stl", ".glb", ".obj", ".png", ".jpg", ".jpeg"],
    "Solo se permiten archivos 3D (.stl, .glb, .obj) o imágenes (.png, .jpg, .jpeg)"
);

const filterImages = createFilter(
    [".png", ".jpg", ".jpeg"],
    "Solo imágenes (.png, .jpg, .jpeg)"
);

const filter3D = createFilter(
    [".stl", ".glb", ".obj"],
    "Solo archivos 3D (.stl, .glb, .obj)"
);

/**
 * 3. INSTANCIAS DE MULTER (Conectando Cloudinary + Tus Filtros)
 */
const uploadModelFile = multer({ storage: storage, fileFilter: filterAll });
const uploadImageFile = multer({ storage: storage, fileFilter: filterImages });
const uploadPartsFile = multer({ storage: storage, fileFilter: filter3D });
const uploadMainImageFile = multer({ storage: storage, fileFilter: filterImages });
const uploadMainFileReplacement = multer({ storage: storage, fileFilter: filter3D });

/**
 * 4. CONFIGURACIÓN DE CAMPOS
 */
const modelUploadFields = uploadModelFile.fields([
    { name: "main_file", maxCount: 1 },
    { name: "cover_image", maxCount: 1 },
    { name: "parts", maxCount: 10 },
    { name: "gallery", maxCount: 10 },
]);

/**
 * 5. WRAPPERS DE ERRORES (Mantenemos tu código intacto)
 */
const createUploadWrapper = (uploadFn, limitErrorMsg) => (req, res, next) => {
    uploadFn(req, res, (err) => {
        if (err instanceof multer.MulterError && err.code === "LIMIT_UNEXPECTED_FILE" && limitErrorMsg) {
            return res.status(400).json({ error: limitErrorMsg });
        }
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        next();
    });
};

const handleMultipleImagesUpload = createUploadWrapper(
    uploadImageFile.array("images", 10)
);

const handleMultiplePartsUpload = createUploadWrapper(
    uploadPartsFile.array("parts", 10)
);

const handleMainImageReplacement = createUploadWrapper(
    uploadMainImageFile.single("image"),
    "Solo puedes subir 1 imagen para la portada."
);

const handleMainFileReplacement = createUploadWrapper(
    uploadMainFileReplacement.single("main_file"),
    "Solo puedes subir 1 archivo 3D principal."
);

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