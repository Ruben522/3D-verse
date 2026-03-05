import multer from "multer";
import path from "path";
import fs from "fs";
import prisma from "../config/prisma.js";

/**
 * Obtiene la carpeta base física de un modelo (donde están main_file, gallery, parts, etc.)
 * a partir de la ruta almacenada en la BD.
 *
 * @param {string} modelId
 * @returns {Promise<string>} Ruta absoluta al directorio base del modelo
 * @throws {Error} Si el modelo no existe
 */
const getModelBaseDirectory = async (modelId) => {
    const model = await prisma.models.findUnique({
        where: { id: modelId },
        select: { file_url: true },
    });

    if (!model)
        throw new Error(
            "Modelo no encontrado en la base de datos.",
        );

    const relativePath = model.file_url.startsWith("/")
        ? model.file_url.slice(1)
        : model.file_url;

    return path.join(
        process.cwd(),
        path.dirname(relativePath),
    );
};

/**
 * Limpia y normaliza el nombre del archivo (reemplaza espacios por _)
 *
 * @param {string} name Nombre original del archivo
 * @param {string} [prefix=""] Prefijo opcional (ej: "cover_", "main_")
 * @returns {string} Nombre limpio
 */
const cleanFileName = (name, prefix = "") => {
    return `${prefix}${name.replace(/\s/g, "_")}`;
};

/**
 * Storage de Multer para la creación inicial de un modelo (subida múltiple de archivos).
 * Crea carpetas dinámicas: /uploads/models/:userId/:timestamp/[parts|gallery]
 *
 * @type {multer.StorageEngine}
 */
const createInitialStorage = (folder) =>
    multer.diskStorage({
        destination: (req, file, cb) => {
            const userId = req.user?.id || "unknown";
            if (!req.uploadId) req.uploadId = Date.now();

            let subFolder = "";
            if (file.fieldname === "parts")
                subFolder = "/parts";
            if (file.fieldname === "gallery")
                subFolder = "/gallery";

            const dir = `uploads/${folder}/${userId}/${req.uploadId}${subFolder}`;
            fs.mkdirSync(dir, { recursive: true });

            cb(null, dir);
        },
        filename: (req, file, cb) => {
            let prefix = "";
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
 * Storage dinámico para subir/reemplazar archivos en modelos ya existentes.
 * Usa la ruta almacenada en BD para determinar el destino.
 *
 * @param {string} [subFolder=""] Subcarpeta adicional (gallery, parts, etc.)
 * @param {boolean} [checkExists=false] Verificar si el archivo ya existe
 * @param {string} [prefix=""] Prefijo para el nombre del archivo
 * @param {boolean} [useTimestamp=false] Añadir timestamp para evitar sobreescritura accidental
 * @returns {multer.StorageEngine}
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

                fs.mkdirSync(finalDir, { recursive: true });
                req.currentUploadDir = finalDir;

                cb(null, finalDir);
            } catch (error) {
                cb(error);
            }
        },
        filename: (req, file, cb) => {
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
                            `El archivo '${cleanName}' ya existe. Cambia el nombre.`,
                        ),
                    );
                }
            }

            cb(null, cleanName);
        },
    });

/**
 * Crea filtro de Multer para validar extensiones permitidas
 *
 * @param {string[]} allowedTypes Extensiones permitidas (con punto)
 * @param {string} errorMsg Mensaje de error personalizado
 * @returns {multer.FileFilter}
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
    "Solo se permiten archivos 3D (.stl, .glb, .obj) o imágenes (.png, .jpg, .jpeg)",
);

const filterImages = createFilter(
    [".png", ".jpg", ".jpeg"],
    "Solo imágenes (.png, .jpg, .jpeg)",
);

const filter3D = createFilter(
    [".stl", ".glb", ".obj"],
    "Solo archivos 3D (.stl, .glb, .obj)",
);

/** Subida inicial completa de modelo (main + cover + parts + gallery) */
const uploadModelFile = multer({
    storage: createInitialStorage("models"),
    fileFilter: filterAll,
});

/** Configuración de campos múltiples para subida inicial */
const modelUploadFields = uploadModelFile.fields([
    { name: "main_file", maxCount: 1 },
    { name: "cover_image", maxCount: 1 },
    { name: "parts", maxCount: 10 },
    { name: "gallery", maxCount: 10 },
]);

/** Añadir múltiples imágenes a la galería (máx 10) */
const uploadImageFile = multer({
    storage: createDynamicStorage("gallery", true),
    fileFilter: filterImages,
});

/** Añadir múltiples partes 3D (máx 10) */
const uploadPartsFile = multer({
    storage: createDynamicStorage("parts", true),
    fileFilter: filter3D,
});

/** Reemplazar imagen de portada (única) */
const uploadMainImageFile = multer({
    storage: createDynamicStorage(
        "",
        false,
        "cover_",
        true,
    ),
    fileFilter: filterImages,
});

/** Reemplazar archivo principal 3D (único) */
const uploadMainFileReplacement = multer({
    storage: createDynamicStorage("", false, "main_", true),
    fileFilter: filter3D,
});

/**
 * Wrapper que captura errores comunes de Multer y responde con JSON 400
 *
 * @param {Function} uploadFn Función multer (single/array/fields)
 * @param {string} [limitErrorMsg] Mensaje personalizado para LIMIT_UNEXPECTED_FILE
 * @returns {import("express").RequestHandler}
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
            }
            if (err) {
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
    "Solo puedes subir 1 imagen para la portada.",
);

const handleMainFileReplacement = createUploadWrapper(
    uploadMainFileReplacement.single("main_file"),
    "Solo puedes subir 1 archivo 3D principal.",
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
