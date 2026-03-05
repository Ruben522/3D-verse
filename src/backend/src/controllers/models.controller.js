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

/**
 * Formatea las rutas de los archivos subidos por Multer para que coincidan con la estructura esperada por la base de datos.
 * Valida que exista el archivo principal 3D.
 *
 * @param {Object} files - Objeto de archivos subidos por Multer (req.files).
 * @param {string} userId - ID del usuario que sube.
 * @param {number|string} uploadId - Identificador temporal de la subida.
 * @returns {Object} Objeto con rutas formateadas: main_file, cover_image, parts y gallery.
 * @throws {Error} Si falta el archivo principal (main_file).
 */
const formatUploadedFiles = (files, userId, uploadId) => {
    if (!files || !files["main_file"]) {
        throw new Error(
            "El archivo principal 3D es obligatorio.",
        );
    }

    const baseUrl = `/uploads/models/${userId}/${uploadId}`;

    return {
        main_file: `${baseUrl}/${files["main_file"][0].filename}`,
        cover_image: files["cover_image"]
            ? `${baseUrl}/${files["cover_image"][0].filename}`
            : null,
        parts: (files["parts"] || []).map((file) => ({
            part_name: file.originalname.split(".")[0],
            file_url: `${baseUrl}/parts/${file.filename}`,
            file_size: file.size,
        })),
        gallery: (files["gallery"] || []).map(
            (file) => `${baseUrl}/gallery/${file.filename}`,
        ),
    };
};

/**
 * Prepara y devuelve las rutas de los archivos subidos en la creación inicial del modelo.
 * No guarda en BD aún (solo organiza archivos).
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const uploadModel = async (req, res) => {
    try {
        const formattedFiles = formatUploadedFiles(
            req.files,
            req.user.id,
            req.uploadId,
        );

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

/**
 * Crea el registro del modelo en la base de datos usando los datos enviados y las rutas preparadas.
 * Requiere autenticación.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const create = async (req, res) => {
    try {
        if (
            !req.body ||
            Object.keys(req.body).length === 0
        ) {
            return sendError(
                res,
                "Los datos del modelo son obligatorios.",
                400,
            );
        }

        const model = await createModel(
            req.user.id,
            req.body,
        );
        sendSuccess(
            res,
            "Modelo publicado con éxito.",
            model,
            201,
        );
    } catch (error) {
        sendError(res, error.message, 400);
    }
};

/**
 * Obtiene los datos completos de un modelo por su ID (incluye relaciones).
 * Endpoint público.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const getById = async (req, res) => {
    try {
        const model = await getModelById(req.params.id);
        sendSuccess(
            res,
            "Modelo recuperado correctamente.",
            model,
        );
    } catch (error) {
        const status =
            error.message.includes(
                "Modelo no encontrado",
            ) || error.code === "P2025"
                ? 404
                : 500;
        sendError(res, error.message, status);
    }
};

/**
 * Obtiene los modelos paginados creados por un usuario específico.
 * Endpoint público.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const getByUser = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const models = await getModelsByUser(
            req.params.userId,
            { page, limit },
        );
        sendSuccess(
            res,
            "Modelos del usuario recuperados.",
            models,
        );
    } catch (error) {
        sendError(res, error.message, 500);
    }
};

/**
 * Obtiene todos los modelos paginados de la plataforma.
 * Endpoint público.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const getAll = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const models = await getModels({ page, limit });
        sendSuccess(
            res,
            "Modelos recuperados correctamente.",
            models,
        );
    } catch (error) {
        sendError(res, error.message, 500);
    }
};

/**
 * Actualiza los campos textuales y metadatos básicos de un modelo.
 * Requiere ser propietario o administrador.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const update = async (req, res) => {
    try {
        const model = await updateModel(
            req.params.id,
            req.user,
            req.body,
        );
        sendSuccess(
            res,
            "Modelo actualizado correctamente.",
            model,
        );
    } catch (error) {
        const status = error.code === "P2025" ? 404 : 400;
        sendError(res, error.message, status);
    }
};

/**
 * Elimina un modelo completo (BD + archivos físicos).
 * Requiere ser propietario o administrador.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const remove = async (req, res) => {
    try {
        const result = await deleteModel(
            req.params.id,
            req.user,
        );
        sendSuccess(res, result.message);
    } catch (error) {
        const status = error.code === "P2025" ? 404 : 403;
        sendError(res, error.message, status);
    }
};

/**
 * Registra un like del usuario autenticado al modelo.
 * Idempotente (si ya existe, no falla).
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const like = async (req, res) => {
    try {
        const result = await addLike(
            req.params.id,
            req.user.id,
        );
        sendSuccess(
            res,
            "Like añadido correctamente.",
            result,
        );
    } catch (error) {
        sendError(res, error.message, 400);
    }
};

/**
 * Retira el like del usuario autenticado al modelo.
 * Idempotente (si no existía, no falla).
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const unlike = async (req, res) => {
    try {
        const result = await removeLike(
            req.params.id,
            req.user.id,
        );
        sendSuccess(
            res,
            "Like retirado correctamente.",
            result,
        );
    } catch (error) {
        sendError(res, error.message, 400);
    }
};

/**
 * Reemplaza el archivo 3D principal del modelo.
 * Borra el archivo anterior del disco.
 * Requiere ser propietario o admin.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const patchMainFile = async (req, res) => {
    try {
        if (!req.file) {
            return sendError(
                res,
                "Debe proporcionar el nuevo archivo 3D.",
                400,
            );
        }

        const fullPath = req.file.path.replace(/\\/g, "/");
        const newFileUrl = fullPath.substring(
            fullPath.indexOf("/uploads/"),
        );

        const updatedModel = await replaceMainFile(
            req.params.id,
            req.user,
            newFileUrl,
        );
        sendSuccess(
            res,
            "Archivo principal actualizado correctamente.",
            updatedModel,
        );
    } catch (error) {
        sendError(res, error.message, 400);
    }
};

/**
 * Reemplaza la imagen de portada (main_image) del modelo.
 * Borra la imagen anterior del disco.
 * Requiere ser propietario o admin.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const patchMainImage = async (req, res) => {
    try {
        if (!req.file) {
            return sendError(
                res,
                "Debe proporcionar una imagen.",
                400,
            );
        }

        const fullPath = req.file.path.replace(/\\/g, "/");
        const imageUrl = fullPath.substring(
            fullPath.indexOf("/uploads/"),
        );

        const updatedModel = await updateMainImage(
            req.params.id,
            req.user,
            imageUrl,
        );
        sendSuccess(
            res,
            "Imagen principal actualizada correctamente.",
            updatedModel,
        );
    } catch (error) {
        sendError(res, error.message, 400);
    }
};

/**
 * Elimina la imagen de portada del modelo (BD + disco).
 * Requiere ser propietario o admin.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const removeMainImage = async (req, res) => {
    try {
        const response = await deleteMainImage(
            req.params.id,
            req.user,
        );
        sendSuccess(res, response.message);
    } catch (error) {
        sendError(res, error.message, 400);
    }
};

export {
    uploadModel,
    create,
    getById,
    getAll,
    getByUser,
    update,
    remove,
    like,
    unlike,
    patchMainFile,
    patchMainImage,
    removeMainImage,
};
