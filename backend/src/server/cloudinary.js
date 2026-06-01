import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const multerStorage = require('multer-storage-cloudinary');

// Esto busca si está dentro de la propiedad o si el paquete es el propio constructor
const CloudinaryStorage = multerStorage.CloudinaryStorage || multerStorage;

// 2. CONFIGURACIÓN
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 3. STORAGE
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const isImage = file.mimetype.startsWith('image/');
        return {
            folder: `3dverse/models/${req.user?.id || 'guest'}`,
            resource_type: "auto",
            public_id: `${Date.now()}-${file.originalname.split('.')[0]}`
        };
    },
});

export const uploadCloud = multer({ storage: storage });
export { cloudinary };