import {
    createModel,
    getModelById,
    getModels,
    getModelsByUser,
    deleteModel,
    updateModel,
    addLike,
    removeLike,
    updateMainImage,
    deleteMainImage,
    replaceMainFile,
} from "../services/models.service.js";
import { sendSuccess, sendError } from "../utils/helper/response.helper.js";

/**
 * Formatea los archivos subidos para sincronizar la BD con las rutas generadas por Multer.
 */
const formatUploadedFiles = (files, userId, uploadId) => {
    if (!files || !files["main_file"]) {
        throw new Error("El archivo principal 3D es obligatorio");
    }

    const baseUrl = `/uploads/models/${userId}/${uploadId}`;

    return {
        main_file: `${baseUrl}/${files["main_file"][0].filename}`,
        cover_image: files["cover_image"] ? `${baseUrl}/${files["cover_image"][0].filename}` : null,
        parts: (files["parts"] || []).map((file) => ({
            part_name: file.originalname.split(".")[0],
            file_url: `${baseUrl}/parts/${file.filename}`,
            file_size: file.size,
        })),
        gallery: (files["gallery"] || []).map((file) => `${baseUrl}/gallery/${file.filename}`),
    };
};

/**
 * Prepara y formatea los archivos subidos iniciales.
 */
const uploadModel = async (req, res) => {
    try {
        const formattedFiles = formatUploadedFiles(req.files, req.user.id, req.uploadId);
        sendSuccess(res, "Archivos preparados", { upload_id: req.uploadId, ...formattedFiles }, 201);
    } catch (error) {
        sendError(res, error.message);
    }
};

/**
 * Crea el modelo en la base de datos tras subir los archivos.
 */
const create = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return sendError(res, "Los datos del modelo son obligatorios", 400);
        }
        const model = await createModel(req.user.id, req.body);
        sendSuccess(res, "Modelo publicado con éxito", model, 201);
    } catch (error) {
        sendError(res, error.message);
    }
};

/**
 * Obtiene un modelo específico por ID.
 */
const getById = async (req, res) => {
    try {
        const model = await getModelById(req.params.id);
        sendSuccess(res, "Modelo recuperado", model);
    } catch (error) {
        // Manejo específico del error de "No encontrado"
        if (error.message === "Modelo no encontrado" || error.code === 'P2025') {
            return sendError(res, "El modelo solicitado no existe", 404);
        }
        sendError(res, error.message, 500);
    }
};

/**
 * Obtiene modelos paginados de un usuario específico.
 */
const getByUser = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const models = await getModelsByUser(req.params.userId, { page, limit });
        sendSuccess(res, "Modelos recuperados", models);
    } catch (error) {
        sendError(res, error.message, 500);
    }
};

/**
 * Obtiene todos los modelos paginados.
 */
const getAll = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const models = await getModels({ page, limit });
        sendSuccess(res, "Modelos recuperados", models);
    } catch (error) {
        sendError(res, error.message, 500);
    }
};

/**
 * Actualiza la información de texto del modelo.
 */
const update = async (req, res) => {
    try {
        const model = await updateModel(req.params.id, req.user, req.body);
        sendSuccess(res, "Modelo actualizado", model);
    } catch (error) {
        if (error.code === 'P2025') return sendError(res, "El modelo no existe", 404);
        sendError(res, error.message);
    }
};

/**
 * Elimina un modelo completo.
 */
const remove = async (req, res) => {
    try {
        const result = await deleteModel(req.params.id, req.user);
        sendSuccess(res, result.message);
    } catch (error) {
        if (error.code === 'P2025') return sendError(res, "El modelo no existe", 404);
        sendError(res, error.message, 403);
    }
};

/**
 * Añade un like.
 */
const like = async (req, res) => {
    try {
        const result = await addLike(req.params.id, req.user.id);
        sendSuccess(res, "Like añadido", result);
    } catch (error) {
        sendError(res, error.message);
    }
};

/**
 * Elimina un like.
 */
const unlike = async (req, res) => {
    try {
        const result = await removeLike(req.params.id, req.user.id);
        sendSuccess(res, "Like retirado", result);
    } catch (error) {
        sendError(res, error.message);
    }
};

/**
 * Reemplaza el archivo 3D principal de un modelo.
 */
const patchMainFile = async (req, res) => {
    try {
        if (!req.file) return sendError(res, "Debe proporcionar el nuevo archivo 3D");
        
        const fullPath = req.file.path.replace(/\\/g, "/");
        const newFileUrl = fullPath.substring(fullPath.indexOf("/uploads/"));
        
        const updatedModel = await replaceMainFile(req.params.id, req.user, newFileUrl);
        sendSuccess(res, "Archivo principal actualizado correctamente", updatedModel);
    } catch (error) {
        sendError(res, error.message);
    }
};

/**
 * Reemplaza la imagen principal de un modelo.
 */
const patchMainImage = async (req, res) => {
    try {
        if (!req.file) return sendError(res, "Debe proporcionar una imagen");
        
        const fullPath = req.file.path.replace(/\\/g, "/");
        const imageUrl = fullPath.substring(fullPath.indexOf("/uploads/"));
        
        const updatedModel = await updateMainImage(req.params.id, req.user, imageUrl);
        sendSuccess(res, "Imagen principal actualizada", updatedModel);
    } catch (error) {
        sendError(res, error.message);
    }
};

/**
 * Elimina la imagen principal de un modelo.
 */
const removeMainImage = async (req, res) => {
    try {
        const response = await deleteMainImage(req.params.id, req.user);
        sendSuccess(res, response.message);
    } catch (error) {
        sendError(res, error.message);
    }
};

export {
    create,
    getById,
    getAll,
    getByUser,
    update,
    remove,
    like,
    unlike,
    uploadModel,
    patchMainFile,
    patchMainImage,
    removeMainImage,
};