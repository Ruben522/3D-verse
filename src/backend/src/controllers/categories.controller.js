import {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    getCategoriesByModel,
    addCategoryToModel,
    removeCategoryFromModel,
} from "../services/categories.service.js";
import {
    sendSuccess,
    sendError,
} from "../utils/helper/response.helper.js";

/**
 * Crea una nueva categoría en el sistema.
 * Requiere nombre único.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const create = async (req, res) => {
    try {
        const { name } = req.body;

        if (
            !name ||
            typeof name !== "string" ||
            name.trim() === ""
        ) {
            return sendError(
                res,
                "El nombre de la categoría es obligatorio y no puede estar vacío.",
                400,
            );
        }

        const category = await createCategory(name.trim());
        sendSuccess(
            res,
            "Categoría creada con éxito.",
            category,
            201,
        );
    } catch (error) {
        if (error.code === "P2002") {
            return sendError(
                res,
                "Ya existe una categoría con ese nombre.",
                409,
            );
        }
        sendError(res, error.message + ".", 400);
    }
};

/**
 * Obtiene la lista completa de categorías ordenadas alfabéticamente.
 * Endpoint público.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const getAll = async (req, res) => {
    try {
        const categories = await getCategories();
        sendSuccess(
            res,
            "Categorías recuperadas correctamente.",
            categories,
        );
    } catch (error) {
        sendError(res, error.message + ".", 500);
    }
};

/**
 * Obtiene una categoría específica por su ID, incluyendo conteo de modelos asociados.
 * Endpoint público.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const getOne = async (req, res) => {
    try {
        const category = await getCategoryById(
            req.params.id,
        );
        sendSuccess(
            res,
            "Categoría recuperada correctamente.",
            category,
        );
    } catch (error) {
        sendError(res, error.message + ".", 404);
    }
};

/**
 * Obtiene todas las categorías asignadas a un modelo específico.
 * Endpoint público.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const getByModel = async (req, res) => {
    try {
        const categories = await getCategoriesByModel(
            req.params.modelId,
        );
        sendSuccess(
            res,
            "Categorías del modelo recuperadas correctamente.",
            categories,
        );
    } catch (error) {
        sendError(res, error.message + ".", 404);
    }
};

/**
 * Actualiza el nombre de una categoría existente.
 * El nombre debe seguir siendo único.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const update = async (req, res) => {
    try {
        const { name } = req.body;

        if (
            !name ||
            typeof name !== "string" ||
            name.trim() === ""
        ) {
            return sendError(
                res,
                "El nuevo nombre es obligatorio y no puede estar vacío.",
                400,
            );
        }

        const category = await updateCategory(
            req.params.id,
            name.trim(),
        );
        sendSuccess(
            res,
            "Categoría actualizada correctamente.",
            category,
        );
    } catch (error) {
        if (error.code === "P2002") {
            return sendError(
                res,
                "Ya existe otra categoría con ese nombre.",
                409,
            );
        }
        if (
            error.code === "P2025" ||
            error.message.includes("no encontrada")
        ) {
            return sendError(
                res,
                "Categoría no encontrada.",
                404,
            );
        }
        sendError(res, error.message + ".", 400);
    }
};

/**
 * Elimina una categoría del sistema (las asociaciones con modelos se eliminan automáticamente por CASCADE).
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const remove = async (req, res) => {
    try {
        const result = await deleteCategory(req.params.id);
        sendSuccess(res, result.message);
    } catch (error) {
        sendError(res, error.message + ".", 404);
    }
};

/**
 * Asocia una categoría existente a un modelo.
 * Requiere autenticación y que el usuario sea propietario del modelo o admin.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const addToModel = async (req, res) => {
    try {
        const { categoryId } = req.body;

        if (!categoryId) {
            return sendError(
                res,
                "El ID de la categoría es obligatorio.",
                400,
            );
        }

        const result = await addCategoryToModel(
            req.params.modelId,
            categoryId,
            req.user,
        );

        sendSuccess(res, result.message + ".", null, 201);
    } catch (error) {
        const status = error.message.includes(
            "Modelo no encontrado",
        )
            ? 404
            : 403;
        sendError(res, error.message + ".", status);
    }
};

/**
 * Elimina la asociación entre una categoría y un modelo.
 * Requiere autenticación y que el usuario sea propietario del modelo o admin.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const removeFromModel = async (req, res) => {
    try {
        const result = await removeCategoryFromModel(
            req.params.modelId,
            req.params.categoryId,
            req.user,
        );

        sendSuccess(res, result.message + ".");
    } catch (error) {
        const status = error.message.includes(
            "Modelo no encontrado",
        )
            ? 404
            : 403;
        sendError(res, error.message + ".", status);
    }
};

export {
    create,
    getAll,
    getOne,
    getByModel,
    update,
    remove,
    addToModel,
    removeFromModel,
};
