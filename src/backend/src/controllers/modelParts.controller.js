import {
    createPart,
    getParts,
    getPartsByModelId,
    deletePart,
} from "../services/modelParts.service.js";
import {
    sendSuccess,
    sendError,
} from "../utils/helper/response.helper.js";

/**
 * Crea una o varias piezas (parts) para un modelo a partir de archivos 3D subidos.
 * Requiere autenticación y que el usuario sea propietario del modelo o admin.
 * Genera automáticamente el nombre de la pieza desde el nombre del archivo.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const create = async (req, res) => {
    try {
        const { modelId } = req.params;
        const user = req.user;

        if (!req.files || req.files.length === 0) {
            return sendError(
                res,
                "Debe proporcionar al menos un archivo 3D.",
                400,
            );
        }

        const uploadedParts = [];

        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];
            const fullPath = file.path.replace(/\\/g, "/");
            const uploadsIndex =
                fullPath.indexOf("/uploads/");
            const fileUrl =
                fullPath.substring(uploadsIndex);

            const part_name =
                file.originalname.split(".")[0];

            const data = {
                part_name,
                file_url: fileUrl,
                file_size: file.size,
                color: req.body.color || null,
            };

            const newPart = await createPart(
                user,
                modelId,
                data,
            );
            uploadedParts.push(newPart);
        }

        sendSuccess(
            res,
            "Piezas añadidas correctamente.",
            uploadedParts,
            201,
        );
    } catch (error) {
        const status = error.message.includes(
            "Modelo no encontrado",
        )
            ? 404
            : 400;
        sendError(res, error.message, status);
    }
};

/**
 * Obtiene una lista paginada de todas las piezas registradas en el sistema.
 * Útil principalmente para administración.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const getAll = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const parts = await getParts({ page, limit });
        sendSuccess(
            res,
            "Piezas recuperadas correctamente.",
            parts,
        );
    } catch (error) {
        sendError(res, error.message, 500);
    }
};

/**
 * Obtiene todas las piezas asociadas a un modelo específico.
 * Endpoint público.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const getByModel = async (req, res) => {
    try {
        const parts = await getPartsByModelId(
            req.params.modelId,
        );
        sendSuccess(
            res,
            "Piezas del modelo recuperadas correctamente.",
            parts,
        );
    } catch (error) {
        sendError(res, error.message, 404);
    }
};

/**
 * Elimina una pieza específica (de la base de datos y del sistema de archivos).
 * Requiere autenticación y que el usuario sea propietario del modelo o admin.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const remove = async (req, res) => {
    try {
        const result = await deletePart(
            req.params.id,
            req.user,
        );
        sendSuccess(res, result.message);
    } catch (error) {
        const status = error.message.includes(
            "Parte no encontrada",
        )
            ? 404
            : 403;
        sendError(res, error.message, status);
    }
};

export { create, getAll, getByModel, remove };
