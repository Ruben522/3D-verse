import prisma from "../config/prisma.js";
import { checkPermission } from "../utils/checkPermission.js";

const addImage = async (user, modelId, imageUrl, displayOrder = 0) => {
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

const updateImageOrder = async (imageId, user, newDisplayOrder) => {
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

    return { message: "Imagen eliminada correctamente" };
};

export { addImage, getModelImages, updateImageOrder, deleteImage };