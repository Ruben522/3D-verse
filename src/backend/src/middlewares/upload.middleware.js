import multer from "multer";
import path from "path";
import fs from "fs";
import pool from "../config/db.js";

const createStorage = (folder) => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            const userId = req.user?.id || "unknown";
            if (!req.uploadId) req.uploadId = Date.now();
            let subFolder = "";
            if (file.fieldname === "parts")
                subFolder = "/parts";
            else if (file.fieldname === "gallery")
                subFolder = "/gallery";
            const dir = `uploads/${folder}/${userId}/${req.uploadId}${subFolder}`;
            if (!fs.existsSync(dir))
                fs.mkdirSync(dir, { recursive: true });
            cb(null, dir);
        },
        filename: (req, file, cb) => {
            const cleanName = file.originalname.replace(
                /\s/g,
                "_",
            );
            cb(null, cleanName);
        },
    });
};

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        ".stl",
        ".glb",
        ".png",
        ".jpg",
        ".jpeg",
    ];
    const ext = path
        .extname(file.originalname)
        .toLowerCase();
    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Tipo de archivo no permitido. Usa STL, GLB, PNG, JPG o JPEG.",
            ),
        );
    }
};

const uploadModelFile = multer({
    storage: createStorage("models"),
    fileFilter,
});

const modelUploadFields = uploadModelFile.fields([
    { name: "main_file", maxCount: 1 },
    { name: "cover_image", maxCount: 1 },
    { name: "parts", maxCount: 10 },
    { name: "gallery", maxCount: 10 },
]);

const galleryStorage = multer.diskStorage({
    destination: async (req, file, cb) => {
        try {
            const { modelId } = req.params;
            const result = await pool.query(
                "SELECT file_url FROM models WHERE id = $1",
                [modelId],
            );

            if (result.rows.length === 0) {
                return cb(
                    new Error(
                        "Modelo no encontrado en la base de datos",
                    ),
                );
            }

            const fileUrl = result.rows[0].file_url;
            const relativePath = fileUrl.startsWith("/")
                ? fileUrl.slice(1)
                : fileUrl;
            const modelFolder = path.dirname(relativePath);
            const finalDir = path.join(
                process.cwd(),
                modelFolder,
                "gallery",
            );

            if (!fs.existsSync(finalDir)) {
                fs.mkdirSync(finalDir, { recursive: true });
            }

            req.currentGalleryDir = finalDir;
            cb(null, finalDir);
        } catch (error) {
            cb(error);
        }
    },
    filename: (req, file, cb) => {
        const cleanName = file.originalname.replace(
            /\s/g,
            "_",
        );
        const fullPath = path.join(
            req.currentGalleryDir,
            cleanName,
        );

        if (fs.existsSync(fullPath)) {
            return cb(
                new Error(
                    `La imagen '${cleanName}' ya existe en esta galería.`,
                ),
            );
        }

        cb(null, cleanName);
    },
});

const imageFileFilter = (req, file, cb) => {
    const allowedTypes = [".png", ".jpg", ".jpeg"];
    const ext = path
        .extname(file.originalname)
        .toLowerCase();
    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Solo se permiten imágenes (PNG, JPG, JPEG)",
            ),
        );
    }
};

const uploadImageFile = multer({
    storage: galleryStorage,
    fileFilter: imageFileFilter,
});

const handleMultipleImagesUpload = (req, res, next) => {
    const upload = uploadImageFile.array("images", 10);
    upload(req, res, function (err) {
        if (err)
            return res
                .status(400)
                .json({ error: err.message });
        next();
    });
};

const mainImageStorage = multer.diskStorage({
    destination: async (req, file, cb) => {
        try {
            const modelId = req.params.id;
            const result = await pool.query(
                "SELECT file_url FROM models WHERE id = $1",
                [modelId],
            );

            if (result.rows.length === 0) {
                return cb(
                    new Error(
                        "Modelo no encontrado en la base de datos",
                    ),
                );
            }

            const fileUrl = result.rows[0].file_url;
            const relativePath = fileUrl.startsWith("/")
                ? fileUrl.slice(1)
                : fileUrl;

            const modelFolder = path.dirname(relativePath);
            const finalDir = path.join(
                process.cwd(),
                modelFolder,
            );

            if (!fs.existsSync(finalDir)) {
                fs.mkdirSync(finalDir, { recursive: true });
            }

            req.currentMainImageDir = finalDir;
            cb(null, finalDir);
        } catch (error) {
            cb(error);
        }
    },
    filename: (req, file, cb) => {
        const cleanName = file.originalname.replace(
            /\s/g,
            "_",
        );
        const fullPath = path.join(
            req.currentMainImageDir,
            cleanName,
        );

        if (fs.existsSync(fullPath)) {
            return cb(
                new Error(
                    `La imagen '${cleanName}' ya existe en la raíz del modelo. Cambia el nombre de tu archivo.`,
                ),
            );
        }

        cb(null, cleanName);
    },
});

const uploadMainImageFile = multer({
    storage: mainImageStorage,
    fileFilter: imageFileFilter,
});

const partsStorage = multer.diskStorage({
    destination: async (req, file, cb) => {
        try {
            const { modelId } = req.params;

            const result = await pool.query(
                "SELECT file_url FROM models WHERE id = $1",
                [modelId],
            );

            if (result.rows.length === 0) {
                return cb(
                    new Error(
                        "Modelo no encontrado en la base de datos",
                    ),
                );
            }

            const fileUrl = result.rows[0].file_url;
            const relativePath = fileUrl.startsWith("/")
                ? fileUrl.slice(1)
                : fileUrl;
            const modelFolder = path.dirname(relativePath);

            const finalDir = path.join(
                process.cwd(),
                modelFolder,
                "parts",
            );

            if (!fs.existsSync(finalDir)) {
                fs.mkdirSync(finalDir, { recursive: true });
            }

            req.currentPartsDir = finalDir;
            cb(null, finalDir);
        } catch (error) {
            cb(error);
        }
    },
    filename: (req, file, cb) => {
        const cleanName = file.originalname.replace(
            /\s/g,
            "_",
        );
        const fullPath = path.join(
            req.currentPartsDir,
            cleanName,
        );

        if (fs.existsSync(fullPath)) {
            return cb(
                new Error(
                    `La pieza '${cleanName}' ya existe en este modelo. Por favor, cámbiale el nombre.`,
                ),
            );
        }

        cb(null, cleanName);
    },
});

const partsFileFilter = (req, file, cb) => {
    const allowedTypes = [".stl", ".glb", ".obj"];
    const ext = path
        .extname(file.originalname)
        .toLowerCase();

    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Solo se permiten archivos 3D (STL, GLB, OBJ) para las piezas.",
            ),
        );
    }
};

const uploadPartsFile = multer({
    storage: partsStorage,
    fileFilter: partsFileFilter,
});

const handleMultiplePartsUpload = (req, res, next) => {
    const upload = uploadPartsFile.array("parts", 10);
    upload(req, res, function (err) {
        if (err)
            return res
                .status(400)
                .json({ error: err.message });
        next();
    });
};

export {
    uploadModelFile,
    modelUploadFields,
    uploadImageFile,
    handleMultipleImagesUpload,
    uploadMainImageFile,
    handleMultiplePartsUpload,
    uploadPartsFile,
};
