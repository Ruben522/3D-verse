import multer from "multer";
import path from "path";
import fs from "fs";

const createStorage = (folder) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = `uploads/${folder}`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const uniqueName =
        Date.now() + "-" + file.originalname.replace(/\s/g, "_");
      cb(null, uniqueName);
    },
  });
};

const fileFilter = (req, file, cb) => {
  const allowedTypes = [".stl", ".glb", ".png", ".jpg", ".jpeg"];

  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Tipo de archivo no permitido"));
  }
};

export const uploadModelFile = multer({
  storage: createStorage("models"),
  fileFilter,
});

export const uploadImageFile = multer({
  storage: createStorage("images"),
  fileFilter,
});