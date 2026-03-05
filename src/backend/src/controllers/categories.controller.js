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
 * Crea una nueva categoría.
 */
const create = async (req, res) => {
    try {
        const { name } = req.body;
        const category = await createCategory(name);
        sendSuccess(
            res,
            "Categoría creada con éxito",
            category,
            201,
        );
    } catch (error) {
        if (error.code === "P2002") {
            return sendError(
                res,
                "Ya existe una categoría con ese nombre",
            );
        }
        sendError(res, error.message);
    }
};

/**
 * Obtiene todas las categorías.
 */
const getAll = async (req, res) => {
    try {
        const categories = await getCategories();
        sendSuccess(
            res,
            "Categorías recuperadas",
            categories,
        );
    } catch (error) {
        sendError(res, error.message, 500);
    }
};

/**
 * Obtiene una categoría por su ID.
 */
const getOne = async (req, res) => {
    try {
        const category = await getCategoryById(
            req.params.id,
        );
        sendSuccess(res, "Categoría recuperada", category);
    } catch (error) {
        sendError(res, error.message, 404);
    }
};

/**
 * Obtiene todas las categorías asignadas a un modelo.
 */
const getByModel = async (req, res) => {
    try {
        const categories = await getCategoriesByModel(
            req.params.modelId,
        );
        sendSuccess(
            res,
            "Categorías del modelo recuperadas",
            categories,
        );
    } catch (error) {
        sendError(res, error.message, 500);
    }
};

/**
 * Actualiza el nombre de una categoría.
 */
const update = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name)
            return sendError(
                res,
                "El nuevo nombre es obligatorio",
            );

        const category = await updateCategory(
            req.params.id,
            name,
        );
        sendSuccess(res, "Categoría actualizada", category);
    } catch (error) {
        if (error.code === "P2002")
            return sendError(
                res,
                "Ya existe otra categoría con ese nombre",
            );
        sendError(res, error.message);
    }
};

/**
 * Elimina una categoría.
 */
const remove = async (req, res) => {
    try {
        const result = await deleteCategory(req.params.id);
        sendSuccess(res, result.message);
    } catch (error) {
        sendError(res, error.message);
    }
};

/**
 * Añade una categoría a un modelo.
 */
const addToModel = async (req, res) => {
    try {
        const { categoryId } = req.body; // O lo puedes sacar de req.params dependiendo de tu ruta

        if (!categoryId) {
            return sendError(
                res,
                "El ID de la categoría es obligatorio",
                400,
            );
        }

        const result = await addCategoryToModel(
            req.params.modelId,
            categoryId,
            req.user,
        );

        sendSuccess(res, result.message, null, 201);
    } catch (error) {
        const status =
            error.message === "Modelo no encontrado"
                ? 404
                : 403;
        sendError(res, error.message, status);
    }
};

/**
 * Elimina una categoría de un modelo.
 */
const removeFromModel = async (req, res) => {
    try {
        const result = await removeCategoryFromModel(
            req.params.modelId,
            req.params.categoryId,
            req.user,
        );

        sendSuccess(res, result.message);
    } catch (error) {
        const status =
            error.message === "Modelo no encontrado"
                ? 404
                : 403;
        sendError(res, error.message, status);
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
