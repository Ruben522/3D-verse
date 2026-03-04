import prisma from "../config/prisma.js";

/**
 * Crea una nueva categoría.
 */
const createCategory = async (name) => {
    if (!name) throw new Error("El nombre de la categoría es obligatorio");

    const category = await prisma.categories.create({
        data: { name }
    });
    return category;
};

/**
 * Obtiene todas las categorías ordenadas alfabéticamente.
 */
const getCategories = async () => {
    const categories = await prisma.categories.findMany({
        orderBy: { name: 'asc' }
    });
    return categories;
};

/**
 * Obtiene una categoría por ID, incluyendo cuántos modelos la están usando.
 */
const getCategoryById = async (id) => {
    const category = await prisma.categories.findUnique({
        where: { id },
        include: {
            _count: {
                select: { model_category: true } // Cuenta cuántos modelos tienen esta categoría
            }
        }
    });

    if (!category) throw new Error("Categoría no encontrada");
    return category;
};

/**
 * Actualiza el nombre de una categoría.
 */
const updateCategory = async (id, name) => {
    try {
        const updatedCategory = await prisma.categories.update({
            where: { id },
            data: { name }
        });
        return updatedCategory;
    } catch (error) {
        if (error.code === 'P2025') throw new Error("Categoría no encontrada");
        throw error;
    }
};

/**
 * Elimina una categoría. (La tabla puente model_category se limpiará sola por el CASCADE).
 */
const deleteCategory = async (id) => {
    try {
        await prisma.categories.delete({
            where: { id }
        });
        return { message: "Categoría eliminada correctamente" };
    } catch (error) {
        if (error.code === 'P2025') throw new Error("Categoría no encontrada");
        throw error;
    }
};

/**
 * Obtiene todas las categorías asociadas a un modelo específico.
 */
const getCategoriesByModel = async (modelId) => {
    const categories = await prisma.categories.findMany({
        where: {
            model_category: {
                some: { model_id: modelId }
            }
        },
        orderBy: { name: 'asc' }
    });
    
    return categories;
};

export { 
    createCategory, 
    getCategories, 
    getCategoryById, 
    updateCategory, 
    deleteCategory,
    getCategoriesByModel
};