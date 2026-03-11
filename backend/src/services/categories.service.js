import prisma from "../config/prisma.js";
import { checkPermission } from "../utils/checkPermission.js";

/**
 * Crea una nueva categoría en el sistema.
 * El nombre debe ser único (restringido por índice único en la base de datos).
 *
 * @param {string} name - Nombre de la categoría (obligatorio)
 * @returns {Promise<Object>} Categoría recién creada
 * @throws {Error} Si el nombre está vacío o no se proporciona
 * @throws {Error} Si ya existe una categoría con ese nombre (error P2002 de Prisma)
 */
const createCategory = async (name) => {
    if (
        !name ||
        typeof name !== "string" ||
        name.trim() === ""
    ) {
        throw new Error(
            "El nombre de la categoría es obligatorio.",
        );
    }

    const category = await prisma.categories.create({
        data: { name: name.trim() },
    });

    return category;
};

/**
 * Obtiene la lista completa de categorías ordenadas alfabéticamente por nombre.
 *
 * @returns {Promise<Array<{ id: string, name: string, created_at: Date, updated_at: Date }>>}
 *          Lista de todas las categorías
 */
const getCategories = async () => {
    const categories = await prisma.categories.findMany({
        orderBy: { name: "asc" },
    });
    return categories;
};

/**
 * Obtiene una categoría por su ID, incluyendo el conteo de modelos que la utilizan.
 *
 * @param {string} id - ID de la categoría
 * @returns {Promise<Object>} Categoría con propiedad _count.model_category
 * @throws {Error} "Categoría no encontrada" si no existe
 */
const getCategoryById = async (id) => {
    const category = await prisma.categories.findUnique({
        where: { id },
        include: {
            _count: { select: { model_category: true } },
        },
    });

    if (!category) {
        throw new Error("Categoría no encontrada.");
    }

    return category;
};

/**
 * Actualiza el nombre de una categoría existente.
 *
 * @param {string} id - ID de la categoría a actualizar
 * @param {string} name - Nuevo nombre de la categoría
 * @returns {Promise<Object>} Categoría actualizada
 * @throws {Error} "Categoría no encontrada" si el ID no existe (P2025)
 * @throws {Error} Si ya existe otra categoría con el nuevo nombre (P2002)
 */
const updateCategory = async (id, name) => {
    if (
        !name ||
        typeof name !== "string" ||
        name.trim() === ""
    ) {
        throw new Error(
            "El nuevo nombre de la categoría no puede estar vacío.",
        );
    }

    try {
        const updatedCategory =
            await prisma.categories.update({
                where: { id },
                data: { name: name.trim() },
            });
        return updatedCategory;
    } catch (error) {
        if (error.code === "P2025") {
            throw new Error("Categoría no encontrada.");
        }
        throw error;
    }
};

/**
 * Elimina una categoría del sistema.
 * Gracias a la restricción ON DELETE CASCADE en model_category,
 * las relaciones con modelos se eliminan automáticamente.
 *
 * @param {string} id - ID de la categoría a eliminar
 * @returns {Promise<{ message: string }>} Mensaje de confirmación
 * @throws {Error} "Categoría no encontrada" si el ID no existe (P2025)
 */
const deleteCategory = async (id) => {
    try {
        await prisma.categories.delete({ where: { id } });
        return {
            message: "Categoría eliminada correctamente.",
        };
    } catch (error) {
        if (error.code === "P2025") {
            throw new Error("Categoría no encontrada.");
        }
        throw error;
    }
};

/**
 * Obtiene todas las categorías asignadas a un modelo específico.
 *
 * @param {string} modelId - ID del modelo
 * @returns {Promise<Array<{ id: string, name: string }>>} Lista de categorías del modelo
 */
const getCategoriesByModel = async (modelId) => {
    const categories = await prisma.categories.findMany({
        where: {
            model_category: { some: { model_id: modelId } },
        },
        orderBy: { name: "asc" },
    });

    return categories;
};

/**
 * Asocia una categoría existente a un modelo.
 * Solo el propietario del modelo o un administrador puede ejecutar esta acción.
 *
 * @param {string} modelId - ID del modelo
 * @param {string} categoryId - ID de la categoría a asignar
 * @param {Object} user - Usuario autenticado que realiza la acción
 * @returns {Promise<{ message: string }>} Resultado de la operación
 * @throws {Error} "Modelo no encontrado"
 * @throws {Error} Si el usuario no tiene permiso sobre el modelo
 */
const addCategoryToModel = async (
    modelId,
    categoryId,
    user,
) => {
    const model = await prisma.models.findUnique({
        where: { id: modelId },
        select: { user_id: true },
    });

    if (!model) throw new Error("Modelo no encontrado.");

    checkPermission(model.user_id, user);

    try {
        await prisma.model_category.create({
            data: {
                model_id: modelId,
                category_id: categoryId,
            },
        });

        return {
            message:
                "Categoría añadida al modelo correctamente.",
        };
    } catch (error) {
        if (error.code === "P2002") {
            return {
                message:
                    "El modelo ya tiene esta categoría asignada.",
            };
        }
        throw error;
    }
};

/**
 * Elimina la asociación entre una categoría y un modelo.
 * Solo el propietario del modelo o un administrador puede ejecutar esta acción.
 *
 * @param {string} modelId - ID del modelo
 * @param {string} categoryId - ID de la categoría a desasociar
 * @param {Object} user - Usuario autenticado que realiza la acción
 * @returns {Promise<{ message: string }>} Resultado de la operación
 * @throws {Error} "Modelo no encontrado"
 * @throws {Error} Si el usuario no tiene permiso sobre el modelo
 */
const removeCategoryFromModel = async (
    modelId,
    categoryId,
    user,
) => {
    const model = await prisma.models.findUnique({
        where: { id: modelId },
        select: { user_id: true },
    });

    if (!model) throw new Error("Modelo no encontrado.");

    checkPermission(model.user_id, user);

    try {
        await prisma.model_category.delete({
            where: {
                model_id_category_id: {
                    model_id: modelId,
                    category_id: categoryId,
                },
            },
        });

        return {
            message: "Categoría eliminada del modelo.",
        };
    } catch (error) {
        if (error.code === "P2025") {
            return {
                message:
                    "La categoría no estaba asignada al modelo.",
            };
        }
        throw error;
    }
};

export {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    getCategoriesByModel,
    addCategoryToModel,
    removeCategoryFromModel,
};
