import prisma from "../config/prisma.js";
import fs from "fs";
import path from "path";
import { checkPermission } from "../utils/checkPermission.js";

/**
 * Añade una nueva imagen a la galería de un modelo.
 * @param {Object} user - Usuario autenticado (para verificar permisos).
 * @param {string} modelId - ID del modelo padre.
 * @param {string} imageUrl - Ruta de la imagen subida.
 * @param {number} displayOrder - Orden de visualización en la galería.
 * @returns {Promise<Object>} El registro de la imagen creada.
 */
const addImage = async (
    user,
    modelId,
    imageUrl,
    displayOrder = 0,
) => {
    const model = await prisma.models.findUnique({
        where: { id: modelId },
        select: { user_id: true },
    });

    if (!model) throw new Error("Modelo no encontrado");

    checkPermission(model.user_id, user);

    const newImage = await prisma.model_images.create({
        data: {
            model_id: modelId,
            image_url: imageUrl,
            display_order: displayOrder,
        },
    });

    return newImage;
};

/**
 * Obtiene todas las imágenes de la galería de un modelo.
 * @param {string} modelId - ID del modelo.
 * @returns {Promise<Array>} Lista de imágenes ordenadas por display_order y fecha.
 */
const getModelImages = async (modelId) => {
    const images = await prisma.model_images.findMany({
        where: { model_id: modelId },
        orderBy: [
            { display_order: "asc" },
            { created_at: "asc" },
        ],
    });

    return images;
};

/**
 * Actualiza el orden de visualización de una imagen en la galería.
 * @param {string} imageId - ID de la imagen a actualizar.
 * @param {Object} user - Usuario autenticado.
 * @param {number} newDisplayOrder - Nuevo número de orden.
 * @returns {Promise<Object>} La imagen actualizada.
 */
const updateImageOrder = async (
    imageId,
    user,
    newDisplayOrder,
) => {
    const image = await prisma.model_images.findUnique({
        where: { id: imageId },
        include: { models: { select: { user_id: true } } },
    });

    if (!image) throw new Error("Imagen no encontrada");

    checkPermission(image.models.user_id, user);

    const updatedImage = await prisma.model_images.update({
        where: { id: imageId },
        data: { display_order: newDisplayOrder },
    });

    return updatedImage;
};

/**
 * Elimina una imagen de la galería, tanto de la DB como del disco duro.
 * @param {string} imageId - ID de la imagen a eliminar.
 * @param {Object} user - Usuario autenticado.
 * @returns {Promise<Object>} Mensaje de confirmación.
 */
const deleteImage = async (imageId, user) => {
    const image = await prisma.model_images.findUnique({
        where: { id: imageId },
        include: { models: { select: { user_id: true } } },
    });

    if (!image) throw new Error("Imagen no encontrada");

    checkPermission(image.models.user_id, user);

    await prisma.model_images.delete({
        where: { id: imageId },
    });

    const relativePath = path.normalize(
        image.image_url.startsWith("/")
            ? image.image_url.slice(1)
            : image.image_url,
    );
    const absolutePath = path.resolve(
        process.cwd(),
        relativePath,
    );

    try {
        if (fs.existsSync(absolutePath)) {
            fs.unlinkSync(absolutePath);
        }
    } catch (fsError) {}

    return { message: "Imagen eliminada correctamente" };
};

export {
    addImage,
    getModelImages,
    updateImageOrder,
    deleteImage,
};
