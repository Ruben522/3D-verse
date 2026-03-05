import prisma from "../config/prisma.js";
import { checkPermission } from "../utils/checkPermission.js";
import {
    deletePhysicalFile,
    deletePhysicalFolder,
} from "../utils/helper/file.helper.js";

/**
 * Crea un nuevo modelo en la base de datos junto con sus relaciones:
 * partes (model_parts), imágenes de galería (model_images), etiquetas (model_tag)
 * y categorías (model_category).
 *
 * @param {string} userId - ID del usuario creador del modelo
 * @param {Object} data - Datos del modelo y sus relaciones
 * @param {string} data.title - Título del modelo (obligatorio)
 * @param {string} [data.main_color] - Color principal (hex o nombre)
 * @param {string} [data.description] - Descripción detallada
 * @param {string} data.file_url - URL del archivo principal 3D
 * @param {string} [data.main_image_url] - URL de la imagen de portada
 * @param {string} [data.video_url] - URL de video demostración (opcional)
 * @param {string} [data.license] - Licencia (por defecto: "All Rights Reserved")
 * @param {Array<Object>} [data.parts] - Lista de partes/componentes
 * @param {Array<string>} [data.images] - Lista de URLs de imágenes (alternativa a gallery)
 * @param {Array<string>} [data.gallery] - Lista de URLs de imágenes (nombre usado por frontend)
 * @param {Array<string>} [data.tags] - IDs de etiquetas existentes
 * @param {Array<string>} [data.categories] - IDs de categorías existentes
 * @returns {Promise<Object>} Modelo creado con sus datos básicos (sin relaciones expandidas)
 * @throws {Error} Si faltan datos obligatorios o hay error en la transacción
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
        gallery,
        tags,
        categories,
    } = data;

    if (
        !title ||
        typeof title !== "string" ||
        title.trim() === ""
    ) {
        throw new Error(
            "El título del modelo es obligatorio.",
        );
    }

    if (
        !file_url ||
        typeof file_url !== "string" ||
        file_url.trim() === ""
    ) {
        throw new Error(
            "La URL del archivo principal es obligatoria.",
        );
    }

    const galleryImages = images || gallery;

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

            model_images: galleryImages?.length
                ? {
                      create: galleryImages.map(
                          (img, index) => ({
                              image_url: img,
                              display_order: index,
                          }),
                      ),
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
 * Obtiene un modelo por su ID, incrementa el contador de vistas en 1
 * y devuelve el modelo completo con todas sus relaciones principales.
 *
 * @param {string} modelId - ID del modelo a consultar
 * @returns {Promise<Object>} Modelo con relaciones: creador, partes, imágenes ordenadas,
 *                           tags, categorías y conteo de likes
 * @throws {Error} "Modelo no encontrado" si no existe
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
 * Devuelve el objeto de inclusión (include) estándar para consultas de listado de modelos.
 * Centraliza las relaciones más usadas para evitar repetir código.
 *
 * @returns {Object} Configuración de include para prisma.models.findMany / findUnique
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
 * Obtiene una lista paginada de todos los modelos públicos,
 * ordenados por fecha de creación descendente (más recientes primero).
 *
 * @param {Object} [options] - Opciones de paginación
 * @param {number} [options.page=1] - Página solicitada (base 1)
 * @param {number} [options.limit=20] - Elementos por página (máx. 50)
 * @returns {Promise<Object>} Objeto paginado con metadata y lista de modelos
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
 * Obtiene una lista paginada de los modelos creados por un usuario específico.
 *
 * @param {string} userId - ID del usuario propietario
 * @param {Object} [options] - Opciones de paginación
 * @param {number} [options.page=1] - Página solicitada
 * @param {number} [options.limit=20] - Elementos por página (máx. 50)
 * @returns {Promise<Object>} Objeto paginado con metadata y lista de modelos del usuario
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
 * Elimina un modelo de la base de datos y su carpeta física completa
 * (incluyendo archivo principal y todas las imágenes asociadas).
 * Requiere permisos de propietario o administrador.
 *
 * @param {string} modelId - ID del modelo a eliminar
 * @param {Object} user - Usuario autenticado que ejecuta la acción
 * @returns {Promise<{ message: string }>} Mensaje de confirmación
 * @throws {Error} "Modelo no encontrado"
 * @throws {Error} Si no tiene permisos suficientes
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
 * Actualiza los campos textuales y de metadatos básicos del modelo.
 * No maneja archivos ni relaciones complejas (partes, imágenes, tags, etc).
 *
 * @param {string} modelId - ID del modelo a actualizar
 * @param {Object} user - Usuario autenticado (debe ser propietario)
 * @param {Object} data - Campos a actualizar
 * @param {string} [data.title] - Nuevo título
 * @param {string} [data.description] - Nueva descripción
 * @param {string} [data.main_color] - Nuevo color principal
 * @param {string} [data.license] - Nueva licencia
 * @param {string} [data.video_url] - Nueva URL de video
 * @returns {Promise<Object>} Modelo actualizado
 * @throws {Error} "Modelo no encontrado"
 * @throws {Error} Si no tiene permisos
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
 * Registra un like del usuario al modelo (si no existe ya).
 * Idempotente: si ya existe el like, no hace nada.
 *
 * @param {string} modelId - ID del modelo
 * @param {string} userId - ID del usuario que da like
 * @returns {Promise<{ likes: number }>} Cantidad actual de likes
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
 * Elimina el like de un usuario a un modelo (si existe).
 * Idempotente: si no existía, no hace nada.
 *
 * @param {string} modelId - ID del modelo
 * @param {string} userId - ID del usuario que retira el like
 * @returns {Promise<{ likes: number }>} Cantidad actual de likes
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
 * Actualiza la imagen principal (portada) del modelo.
 * Borra físicamente la imagen anterior si existía y era diferente.
 *
 * @param {string} modelId - ID del modelo
 * @param {Object} user - Usuario autenticado (debe ser propietario)
 * @param {string} imageUrl - Nueva URL de la imagen principal
 * @returns {Promise<Object>} Modelo actualizado
 * @throws {Error} "Modelo no encontrado"
 * @throws {Error} Si no tiene permisos
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
 * Elimina la imagen principal del modelo tanto de la BD como del sistema de archivos.
 *
 * @param {string} modelId - ID del modelo
 * @param {Object} user - Usuario autenticado (debe ser propietario)
 * @returns {Promise<{ message: string }>} Mensaje de confirmación
 * @throws {Error} "Modelo no encontrado"
 * @throws {Error} "El modelo ya no tiene imagen principal"
 * @throws {Error} Si no tiene permisos
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
 * Reemplaza el archivo principal 3D del modelo.
 * Borra físicamente el archivo anterior si existía y era diferente.
 *
 * @param {string} modelId - ID del modelo
 * @param {Object} user - Usuario autenticado (debe ser propietario)
 * @param {string} newFileUrl - Nueva URL del archivo 3D
 * @returns {Promise<Object>} Modelo actualizado
 * @throws {Error} "Modelo no encontrado"
 * @throws {Error} Si no tiene permisos
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
