import multer from "multer";
import path from "path";
import fs from "fs";

// 1. Configuración dinámica de almacenamiento
const createStorage = (folder) => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            const userId = req.user?.id || "unknown";

            let folderName = req.body.folder_name
                ? req.body.folder_name.replace(
                      /[^a-zA-Z0-9_-]/g,
                      "",
                  )
                : "modelo";

            const uniqueFolder = `${folderName}_${Date.now()}`;
            req.currentFolder =
                req.currentFolder || uniqueFolder;

            // --- LÓGICA DE SUB-CARPETAS ---
            let subFolder = "";
            if (file.fieldname === "parts") {
                subFolder = "/parts";
            } else if (file.fieldname === "gallery") {
                subFolder = "/gallery";
            }
            // ------------------------------

            // Construimos la ruta: uploads/models/USER_ID/FOLDER_ID/parts (o gallery)
            const dir = `uploads/${folder}/${userId}/${req.currentFolder}${subFolder}`;

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            cb(null, dir);
        },
        filename: (req, file, cb) => {
            const uniqueName =
                Date.now() +
                "-" +
                file.originalname.replace(/\s/g, "_");
            cb(null, uniqueName);
        },
    });
};

// 2. Filtro de seguridad para aceptar solo archivos válidos
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

// 3. Instancia de Multer para Modelos (guarda en /uploads/models/)
const uploadModelFile = multer({
    storage: createStorage("models"),
    fileFilter,
    // limits: { fileSize: 100 * 1024 * 1024 } // Opcional: limitar a 100MB por seguridad
});

// Campos específicos para la subida de modelos (Se usa en models.routes.js)
const modelUploadFields = uploadModelFile.fields([
    { name: "main_file", maxCount: 1 },
    { name: "cover_image", maxCount: 1 },
    { name: "parts", maxCount: 10 },
    { name: "gallery", maxCount: 10 },
]);

// 4. Instancia de Multer para Imágenes sueltas (guarda en /uploads/images/)
// (Se usa en modelImages.routes.js)
const uploadImageFile = multer({
    storage: createStorage("images"),
    fileFilter,
});

export {
    uploadModelFile,
    modelUploadFields,
    uploadImageFile,
};
