import prisma from "../config/prisma.js";
import { checkPermission } from "../utils/checkPermission.js";
import {
    deletePhysicalFile,
    deletePhysicalFolder,
} from "../utils/helper/file.helper.js";

/**
 * Crea un nuevo modelo junto con sus piezas, galería, etiquetas y categorías.
 */
const createModel = async (userId, data) => {
    if (!data)
        throw new Error("Faltan los datos del modelo");

    const {
        title,
        main_color,
        description,
        file_url,
        main_image_url,
        video_url,
        license,
        parts,
        images,
        tags,
        categories,
    } = data;

    const model = await prisma.models.create({
        data: {
            user_id: userId,
            title,
            main_color: main_color || null,
            description,
            file_url,
            main_image_url: main_image_url || null,
            video_url,
            license: license || "All Rights Reserved",

            model_parts: parts?.length
                ? {
                      create: parts.map((p) => ({
                          color: p.color || null,
                          part_name: p.part_name,
                          file_url: p.file_url,
                          file_size: p.file_size,
                      })),
                  }
                : undefined,

            model_images: images?.length
                ? {
                      create: images.map((img) => ({
                          image_url: img,
                          display_order: 0,
                      })),
                  }
                : undefined,

            model_tag: tags?.length
                ? {
                      create: tags.map((tagId) => ({
                          tag_id: tagId,
                      })),
                  }
                : undefined,

            model_category: categories?.length
                ? {
                      create: categories.map((catId) => ({
                          category_id: catId,
                      })),
                  }
                : undefined,
        },
    });

    return model;
};

/**
 * Obtiene un modelo por ID, suma una visita y adjunta todas sus relaciones (creador, partes, etc).
 */
const getModelById = async (modelId) => {
    const updatedModel = await prisma.models.update({
        where: { id: modelId },
        data: { views: { increment: 1 } },
        include: {
            users: {
                select: {
                    id: true,
                    username: true,
                    avatar: true,
                },
            },
            model_parts: true,
            model_images: {
                orderBy: { display_order: "asc" },
            },
            model_tag: { include: { tags: true } },
            model_category: {
                include: { categories: true },
            },
            _count: { select: { model_likes: true } },
        },
    });

    if (!updatedModel)
        throw new Error("Modelo no encontrado");
    return updatedModel;
};

/**
 * Genera la consulta base (include) que usamos en los listados para no repetir código.
 */
const getModelIncludes = () => ({
    users: {
        select: { id: true, username: true, avatar: true },
    },
    model_tag: {
        include: {
            tags: { select: { id: true, name: true } },
        },
    },
    model_category: {
        include: {
            categories: {
                select: { id: true, name: true },
            },
        },
    },
    _count: { select: { model_likes: true } },
});

/**
 * Lista modelos de forma paginada.
 */
const getModels = async ({ page = 1, limit = 20 }) => {
    const safeLimit = Math.min(limit, 50);
    const offset = (page - 1) * safeLimit;

    const [total, models] = await prisma.$transaction([
        prisma.models.count(),
        prisma.models.findMany({
            take: safeLimit,
            skip: offset,
            orderBy: { created_at: "desc" },
            include: getModelIncludes(),
        }),
    ]);

    return {
        page,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
        data: models,
    };
};

/**
 * Lista modelos creados por un usuario específico de forma paginada.
 */
const getModelsByUser = async (
    userId,
    { page = 1, limit = 20 },
) => {
    const safeLimit = Math.min(limit, 50);
    const offset = (page - 1) * safeLimit;

    const [total, models] = await prisma.$transaction([
        prisma.models.count({ where: { user_id: userId } }),
        prisma.models.findMany({
            where: { user_id: userId },
            take: safeLimit,
            skip: offset,
            orderBy: { created_at: "desc" },
            include: getModelIncludes(),
        }),
    ]);

    return {
        page,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
        data: models,
    };
};

/**
 * Elimina un modelo de la BD y toda su carpeta física.
 */
const deleteModel = async (modelId, user) => {
    const model = await prisma.models.findUnique({
        where: { id: modelId },
    });
    if (!model) throw new Error("Modelo no encontrado");

    checkPermission(model.user_id, user);

    await prisma.models.delete({ where: { id: modelId } });

    deletePhysicalFolder(model.file_url);

    return {
        message:
            "Modelo y archivos eliminados correctamente",
    };
};

/**
 * Actualiza la información textual del modelo.
 */
const updateModel = async (modelId, user, data) => {
    const model = await prisma.models.findUnique({
        where: { id: modelId },
    });
    if (!model) throw new Error("Modelo no encontrado");

    checkPermission(model.user_id, user);

    const updatedModel = await prisma.models.update({
        where: { id: modelId },
        data: {
            title: data.title,
            description: data.description,
            main_color: data.main_color,
            license: data.license,
            video_url: data.video_url,
            updated_at: new Date(),
        },
    });

    return updatedModel;
};

/**
 * Añade un like a un modelo.
 */
const addLike = async (modelId, userId) => {
    try {
        await prisma.model_likes.create({
            data: { user_id: userId, model_id: modelId },
        });
    } catch (error) {
        if (error.code !== "P2002") throw error;
    }

    const likesCount = await prisma.model_likes.count({
        where: { model_id: modelId },
    });
    return { likes: likesCount };
};

/**
 * Elimina un like de un modelo.
 */
const removeLike = async (modelId, userId) => {
    try {
        await prisma.model_likes.delete({
            where: {
                user_id_model_id: {
                    user_id: userId,
                    model_id: modelId,
                },
            },
        });
    } catch (error) {
        if (error.code !== "P2025") throw error;
    }

    const likesCount = await prisma.model_likes.count({
        where: { model_id: modelId },
    });
    return { likes: likesCount };
};

/**
 * Reemplaza la imagen de portada en la BD y borra físicamente la anterior.
 */
const updateMainImage = async (modelId, user, imageUrl) => {
    const model = await prisma.models.findUnique({
        where: { id: modelId },
    });
    if (!model) throw new Error("Modelo no encontrado");

    checkPermission(model.user_id, user);

    const updatedModel = await prisma.models.update({
        where: { id: modelId },
        data: { main_image_url: imageUrl },
    });

    if (
        model.main_image_url &&
        model.main_image_url !== imageUrl
    ) {
        deletePhysicalFile(model.main_image_url);
    }

    return updatedModel;
};

/**
 * Borra la imagen principal de la BD y del disco duro.
 */
const deleteMainImage = async (modelId, user) => {
    const model = await prisma.models.findUnique({
        where: { id: modelId },
    });
    if (!model) throw new Error("Modelo no encontrado");

    checkPermission(model.user_id, user);
    if (!model.main_image_url)
        throw new Error(
            "El modelo ya no tiene imagen principal",
        );

    await prisma.models.update({
        where: { id: modelId },
        data: { main_image_url: null },
    });

    deletePhysicalFile(model.main_image_url);

    return {
        message: "Imagen principal eliminada correctamente",
    };
};

/**
 * Reemplaza el archivo principal 3D en la BD y borra físicamente el anterior.
 */
const replaceMainFile = async (
    modelId,
    user,
    newFileUrl,
) => {
    const model = await prisma.models.findUnique({
        where: { id: modelId },
    });
    if (!model) throw new Error("Modelo no encontrado");

    checkPermission(model.user_id, user);

    const updatedModel = await prisma.models.update({
        where: { id: modelId },
        data: { file_url: newFileUrl },
    });

    if (model.file_url && model.file_url !== newFileUrl) {
        deletePhysicalFile(model.file_url);
    }

    return updatedModel;
};

export {
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
};
