import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import 'dotenv/config';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// ... (El resto de tu código se queda igual) ...

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const isImage = file.mimetype.startsWith('image/');

        return {
            folder: `3dverse/models/${req.user?.id || 'guest'}`,
            resource_type: isImage ? 'image' : 'raw',
            public_id: `${Date.now()}-${file.originalname.split('.')[0]}`
        };
    },
});

// 3. Exportamos el middleware de Multer listo para usar
export const uploadCloud = multer({ storage: storage });
export { cloudinary };