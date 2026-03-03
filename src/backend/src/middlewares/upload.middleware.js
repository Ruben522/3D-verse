import multer from "multer";
import path from "path";
import fs from "fs";

// 1. Configuración dinámica de almacenamiento
const createStorage = (folder) => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            // Requerimos que el usuario esté autenticado (req.user debe existir por el verifyToken)
            const userId = req.user?.id || "unknown";

            // Si el usuario envía un 'folder_name' en el req.body, lo sanitizamos. Si no, usamos "modelo"
            let folderName = req.body.folder_name
                ? req.body.folder_name.replace(
                      /[^a-zA-Z0-9_-]/g,
                      "",
                  )
                : "modelo";

            // Creamos un sufijo único con la fecha/hora actual
            const uniqueFolder = `${folderName}_${Date.now()}`;

            // Usamos req.currentFolder para que todos los archivos de esta misma petición
            // (principal, portada, partes) vayan exactamente a la misma carpeta.
            req.currentFolder =
                req.currentFolder || uniqueFolder;

            // Construimos la ruta física: uploads/models/ID_USUARIO/NOMBRE_CARPETA/
            const dir = `uploads/${folder}/${userId}/${req.currentFolder}`;

            // Si la carpeta no existe, Node.js la crea (recursive: true crea las subcarpetas necesarias)
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            cb(null, dir);
        },
        filename: (req, file, cb) => {
            // Generamos un nombre único para evitar que archivos con el mismo nombre se sobrescriban
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
