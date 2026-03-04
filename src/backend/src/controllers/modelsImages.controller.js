import {
    addImage,
    getModelImages,
    updateImageOrder,
    deleteImage,
} from "../services/modelsImages.service.js";
import {
    sendSuccess,
    sendError,
} from "../utils/helper/response.helper.js";

/**
 * Sube una o varias imágenes a la galería secundaria de un modelo.
 */
const uploadImage = async (req, res) => {
    try {
        const { modelId } = req.params;
        const user = req.user;

        if (!req.files || req.files.length === 0) {
            return sendError(
                res,
                "Debe proporcionar al menos una imagen",
                400,
            );
        }

        const uploadedImages = [];
        let baseOrder =
            parseInt(req.body.display_order) || 0;

        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];

            const fullPath = file.path.replace(/\\/g, "/");
            const uploadsIndex =
                fullPath.indexOf("/uploads/");
            const imageUrl =
                fullPath.substring(uploadsIndex);

            const newImage = await addImage(
                user,
                modelId,
                imageUrl,
                baseOrder + i,
            );

            uploadedImages.push(newImage);
        }

        sendSuccess(
            res,
            "Imágenes subidas correctamente",
            uploadedImages,
            201,
        );
    } catch (error) {
        const status =
            error.message === "Modelo no encontrado"
                ? 404
                : 400;
        sendError(res, error.message, status);
    }
};

/**
 * Obtiene todas las imágenes de la galería de un modelo específico.
 */
const getImages = async (req, res) => {
    try {
        const images = await getModelImages(
            req.params.modelId,
        );
        sendSuccess(
            res,
            "Imágenes de la galería recuperadas",
            images,
        );
    } catch (error) {
        sendError(res, error.message, 400);
    }
};

/**
 * Actualiza el orden de visualización (display_order) de una imagen en la galería.
 */
const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { display_order } = req.body;

        if (display_order === undefined) {
            return sendError(
                res,
                "El campo display_order es requerido",
                400,
            );
        }

        const updatedImage = await updateImageOrder(
            id,
            req.user,
            display_order,
        );
        sendSuccess(
            res,
            "Orden de imagen actualizado",
            updatedImage,
        );
    } catch (error) {
        const status =
            error.message === "Imagen no encontrada"
                ? 404
                : 400;
        sendError(res, error.message, status);
    }
};

/**
 * Elimina una imagen de la galería de un modelo (tanto de BD como del disco).
 */
const removeImage = async (req, res) => {
    try {
        const response = await deleteImage(
            req.params.id,
            req.user,
        );
        sendSuccess(res, response.message);
    } catch (error) {
        const status =
            error.message === "Imagen no encontrada"
                ? 404
                : 403;
        sendError(res, error.message, status);
    }
};

export { uploadImage, getImages, updateOrder, removeImage };
