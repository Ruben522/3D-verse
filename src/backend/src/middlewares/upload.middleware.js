import multer from "multer";
import path from "path";
import fs from "fs";

const createStorage = (folder) => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            const userId = req.user.id;
            const dir = `uploads/${folder}/${userId}`;

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
        cb(new Error("Tipo de archivo no permitido"));
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
const uploadImageFile = multer({
    storage: createStorage("images"),
    fileFilter,
});

export {
    uploadModelFile,
    modelUploadFields,
    uploadImageFile,
};
