import multer from "multer";
import path from "path";
import fs from "fs";
import prisma from "../config/prisma.js";

/**
 * Obtiene el directorio base de un modelo desde la BD usando Prisma.
 */
const getModelBaseDirectory = async (modelId) => {
    const model = await prisma.models.findUnique({
        where: { id: modelId },
        select: { file_url: true },
    });

    if (!model) {
        throw new Error(
            "Modelo no encontrado en la base de datos",
        );
    }

    const fileUrl = model.file_url;
    const relativePath = fileUrl.startsWith("/")
        ? fileUrl.slice(1)
        : fileUrl;

    return path.join(
        process.cwd(),
        path.dirname(relativePath),
    );
};

/**
 * Limpia el nombre del archivo y le añade un prefijo opcional.
 */
const cleanFileName = (name, prefix = "") => {
    return `${prefix}${name.replace(/\s/g, "_")}`;
};

/**
 * Crea el almacenamiento para subir un modelo nuevo por primera vez.
 */
const createInitialStorage = (folder) =>
    multer.diskStorage({
        destination: (req, file, cb) => {
            const userId = req.user?.id || "unknown";
            if (!req.uploadId) req.uploadId = Date.now();

            let subFolder = "";
            if (file.fieldname === "parts")
                subFolder = "/parts";
            else if (file.fieldname === "gallery")
                subFolder = "/gallery";

            const dir = `uploads/${folder}/${userId}/${req.uploadId}${subFolder}`;

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            cb(null, dir);
        },
        filename: (req, file, cb) => {
            let prefix = ""; // Restauramos los prefijos para que coincidan siempre
            if (file.fieldname === "cover_image")
                prefix = "cover_";
            if (file.fieldname === "main_file")
                prefix = "main_";

            cb(
                null,
                cleanFileName(file.originalname, prefix),
            );
        },
    });

/**
 * Crea almacenamiento dinámico para añadir o reemplazar archivos.
 * @param {boolean} useTimestamp - Si es true, añade una marca de tiempo para evitar el borrado fatal de Multer.
 */
const createDynamicStorage = (
    subFolder = "",
    checkExists = false,
    prefix = "",
    useTimestamp = false,
) =>
    multer.diskStorage({
        destination: async (req, file, cb) => {
            try {
                const modelId =
                    req.params.modelId || req.params.id;
                const baseDir =
                    await getModelBaseDirectory(modelId);
                const finalDir = path.join(
                    baseDir,
                    subFolder,
                );

                if (!fs.existsSync(finalDir)) {
                    fs.mkdirSync(finalDir, {
                        recursive: true,
                    });
                }

                req.currentUploadDir = finalDir;
                cb(null, finalDir);
            } catch (error) {
                cb(error);
            }
        },
        filename: (req, file, cb) => {
            // Si es un reemplazo de archivo único, usamos timestamp para asegurar el archivo original
            const timeSuffix = useTimestamp
                ? `${Date.now()}_`
                : "";
            const cleanName = cleanFileName(
                file.originalname,
                `${prefix}${timeSuffix}`,
            );

            if (checkExists) {
                const fullPath = path.join(
                    req.currentUploadDir,
                    cleanName,
                );
                if (fs.existsSync(fullPath)) {
                    return cb(
                        new Error(
                            `El archivo '${cleanName}' ya existe en este modelo. Cambia el nombre.`,
                        ),
                    );
                }
            }
            cb(null, cleanName);
        },
    });

/**
 * Genera un filtro de extensiones permitidas.
 */
const createFilter =
    (allowedTypes, errorMsg) => (req, file, cb) => {
        const ext = path
            .extname(file.originalname)
            .toLowerCase();
        if (allowedTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error(errorMsg));
        }
    };

const filterAll = createFilter(
    [".stl", ".glb", ".obj", ".png", ".jpg", ".jpeg"],
    "Tipo no permitido. Usa 3D o imágenes.",
);
const filterImages = createFilter(
    [".png", ".jpg", ".jpeg"],
    "Solo se permiten imágenes (PNG, JPG, JPEG).",
);
const filter3D = createFilter(
    [".stl", ".glb", ".obj"],
    "Solo se permiten archivos 3D (STL, GLB, OBJ).",
);

const uploadModelFile = multer({
    storage: createInitialStorage("models"),
    fileFilter: filterAll,
});

const modelUploadFields = uploadModelFile.fields([
    { name: "main_file", maxCount: 1 },
    { name: "cover_image", maxCount: 1 },
    { name: "parts", maxCount: 10 },
    { name: "gallery", maxCount: 10 },
]);

// Instancias dinámicas (Galería y Piezas limpias; Reemplazos Principales protegidos)
const uploadImageFile = multer({
    storage: createDynamicStorage("gallery", true),
    fileFilter: filterImages,
});
const uploadPartsFile = multer({
    storage: createDynamicStorage("parts", true),
    fileFilter: filter3D,
});
const uploadMainImageFile = multer({
    storage: createDynamicStorage(
        "",
        false,
        "cover_",
        true,
    ),
    fileFilter: filterImages,
});
const uploadMainFileReplacement = multer({
    storage: createDynamicStorage("", false, "main_", true),
    fileFilter: filter3D,
});

/**
 * Envoltorio para capturar errores de límite de Multer.
 */
const createUploadWrapper =
    (uploadFn, limitErrorMsg) => (req, res, next) => {
        uploadFn(req, res, (err) => {
            if (
                err instanceof multer.MulterError &&
                err.code === "LIMIT_UNEXPECTED_FILE" &&
                limitErrorMsg
            ) {
                return res
                    .status(400)
                    .json({ error: limitErrorMsg });
            } else if (err) {
                return res
                    .status(400)
                    .json({ error: err.message });
            }
            next();
        });
    };

const handleMultipleImagesUpload = createUploadWrapper(
    uploadImageFile.array("images", 10),
);
const handleMultiplePartsUpload = createUploadWrapper(
    uploadPartsFile.array("parts", 10),
);
const handleMainImageReplacement = createUploadWrapper(
    uploadMainImageFile.single("image"),
    "Solo puedes subir una (1) imagen para la portada.",
);
const handleMainFileReplacement = createUploadWrapper(
    uploadMainFileReplacement.single("main_file"),
    "Solo puedes subir un (1) archivo 3D principal.",
);

export {
    uploadModelFile,
    modelUploadFields,
    uploadImageFile,
    uploadPartsFile,
    uploadMainFileReplacement,
    uploadMainImageFile,
    handleMultipleImagesUpload,
    handleMultiplePartsUpload,
    handleMainImageReplacement,
    handleMainFileReplacement,
};
