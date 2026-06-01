import { addImage, getModelImages, updateImageOrder, deleteImage } from "../services/modelsImages.service.js";
import { sendSuccess, sendError } from "../utils/helper/response.helper.js";

const uploadImage = async (req, res) => {
    try {
        const { modelId } = req.params;
        const user = req.user;

        if (!req.files || req.files.length === 0) {
            return sendError(res, "Debe proporcionar al menos una imagen.", 400);
        }

        const uploadedImages = [];
        let baseOrder = parseInt(req.body.display_order) || 0;

        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];

            // Usamos directamente file.path que trae la URL de Cloudinary
            const newImage = await addImage(user, modelId, file.path, baseOrder + i);
            uploadedImages.push(newImage);
        }

        sendSuccess(res, "Imágenes subidas correctamente.", uploadedImages, 201);
    } catch (error) {
        const status = error.message.includes("Modelo no encontrado") ? 404 : 400;
        sendError(res, error.message, status);
    }
};

const getImages = async (req, res) => {
    try {
        const images = await getModelImages(req.params.modelId);
        sendSuccess(res, "Imágenes de la galería recuperadas.", images);
    } catch (error) {
        sendError(res, error.message, 400);
    }
};

const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { display_order } = req.body;

        if (display_order === undefined) {
            return sendError(res, "El campo display_order es requerido.", 400);
        }

        const updatedImage = await updateImageOrder(id, req.user, display_order);
        sendSuccess(res, "Orden de imagen actualizado.", updatedImage);
    } catch (error) {
        const status = error.message.includes("Imagen no encontrada") ? 404 : 400;
        sendError(res, error.message, status);
    }
};

const removeImage = async (req, res) => {
    try {
        const response = await deleteImage(req.params.id, req.user);
        sendSuccess(res, response.message);
    } catch (error) {
        const status = error.message.includes("Imagen no encontrada") ? 404 : 403;
        sendError(res, error.message, status);
    }
};

export { uploadImage, getImages, updateOrder, removeImage };