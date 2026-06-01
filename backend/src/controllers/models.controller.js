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
import {
    sendSuccess,
    sendError,
} from "../utils/helper/response.helper.js";
import { syncModelToMeili, deleteModelFromMeili } from '../server/meilisearchSync.js';

/**
 * Formatea las rutas devueltas por Cloudinary para la base de datos.
 */
const formatUploadedFiles = (files) => {
    if (!files || !files["main_file"]) {
        throw new Error("El archivo principal 3D es obligatorio.");
    }

    return {
        main_file: files["main_file"][0].path,
        cover_image: files["cover_image"] ? files["cover_image"][0].path : null,
        parts: (files["parts"] || []).map((file) => ({
            part_name: file.originalname.split(".")[0],
            file_url: file.path,
            file_size: file.size,
        })),
        gallery: (files["gallery"] || []).map((file) => file.path),
    };
};

const uploadModel = async (req, res) => {
    try {
        const formattedFiles = formatUploadedFiles(req.files);

        sendSuccess(
            res,
            "Archivos preparados correctamente.",
            { upload_id: req.uploadId, ...formattedFiles },
            201,
        );
    } catch (error) {
        sendError(res, error.message, 400);
    }
};

const create = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return sendError(res, "Los datos del modelo son obligatorios.", 400);
        }

        const model = await createModel(req.user.id, req.body);
        const modelId = model?.id || model?.model?.id || model?.data?.id;

        if (modelId) {
            await syncModelToMeili(modelId);
        } else {
            console.warn("⚠️ No se encontró el ID del modelo para Meilisearch. Datos:", model);
        }

        sendSuccess(res, "Modelo publicado con éxito.", model, 201);
    } catch (error) {
        sendError(res, error.message, 400);
    }
};

const getById = async (req, res) => {
    try {
        const model = await getModelById(req.params.id);
        sendSuccess(res, "Modelo recuperado correctamente.", model);
    } catch (error) {
        const status = error.message.includes("Modelo no encontrado") || error.code === "P2025" ? 404 : 500;
        sendError(res, error.message, status);
    }
};

const getByUser = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const models = await getModelsByUser(req.params.userId, { page, limit });
        sendSuccess(res, "Modelos del usuario recuperados.", models);
    } catch (error) {
        sendError(res, error.message, 500);
    }
};

const getAll = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const models = await getModels({ page, limit });
        sendSuccess(res, "Modelos recuperados correctamente.", models);
    } catch (error) {
        sendError(res, error.message, 500);
    }
};

const update = async (req, res) => {
    try {
        const model = await updateModel(req.params.id, req.user, req.body);
        await syncModelToMeili(req.params.id);
        sendSuccess(res, "Modelo actualizado correctamente.", model);
    } catch (error) {
        const status = error.code === "P2025" ? 404 : 400;
        sendError(res, error.message, status);
    }
};

const remove = async (req, res) => {
    try {
        const result = await deleteModel(req.params.id, req.user);
        await deleteModelFromMeili(req.params.id);
        sendSuccess(res, result.message);
    } catch (error) {
        const status = error.code === "P2025" ? 404 : 403;
        sendError(res, error.message, status);
    }
};

const like = async (req, res) => {
    try {
        const result = await addLike(req.params.id, req.user.id);
        sendSuccess(res, "Like añadido correctamente.", result);
    } catch (error) {
        sendError(res, error.message, 400);
    }
};

const unlike = async (req, res) => {
    try {
        const result = await removeLike(req.params.id, req.user.id);
        sendSuccess(res, "Like retirado correctamente.", result);
    } catch (error) {
        sendError(res, error.message, 400);
    }
};

const patchMainFile = async (req, res) => {
    try {
        if (!req.file) {
            return sendError(res, "Debe proporcionar el nuevo archivo 3D.", 400);
        }

        const updatedModel = await replaceMainFile(req.params.id, req.user, req.file.path);
        await syncModelToMeili(req.params.id);
        sendSuccess(res, "Archivo principal actualizado correctamente.", updatedModel);
    } catch (error) {
        sendError(res, error.message, 400);
    }
};

const patchMainImage = async (req, res) => {
    try {
        if (!req.file) {
            return sendError(res, "Debe proporcionar una imagen.", 400);
        }

        const updatedModel = await updateMainImage(req.params.id, req.user, req.file.path);
        await syncModelToMeili(req.params.id);
        sendSuccess(res, "Imagen principal actualizada correctamente.", updatedModel);
    } catch (error) {
        sendError(res, error.message, 400);
    }
};

const removeMainImage = async (req, res) => {
    try {
        const response = await deleteMainImage(req.params.id, req.user);
        await syncModelToMeili(req.params.id);
        sendSuccess(res, response.message);
    } catch (error) {
        sendError(res, error.message, 400);
    }
};

export {
    uploadModel, create, getById, getAll, getByUser, update, remove, like, unlike, patchMainFile, patchMainImage, removeMainImage,
};