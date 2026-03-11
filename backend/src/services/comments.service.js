import prisma from "../config/prisma.js";
import { checkPermission } from "../utils/checkPermission.js";

/**
 * Crea un nuevo comentario en un modelo.
 * @param {string} modelId - ID del modelo comentado.
 * @param {string} userId - ID del usuario que comenta.
 * @param {string} content - Contenido del comentario.
 * @returns {Promise<Object>} El comentario recién creado.
 */
const createComment = async (modelId, userId, content) => {
    const model = await prisma.models.findUnique({
        where: { id: modelId },
    });
    if (!model)
        throw new Error("El modelo solicitado no existe");

    const newComment = await prisma.comments.create({
        data: {
            user_id: userId,
            model_id: modelId,
            content,
        },
        select: {
            id: true,
            user_id: true,
            model_id: true,
            content: true,
            created_at: true,
            updated_at: true,
        },
    });

    return newComment;
};

/**
 * Obtiene los comentarios de un modelo de forma paginada junto con los datos del autor.
 * @param {string} modelId - ID del modelo.
 * @param {Object} pagination - Objeto con page y limit.
 * @returns {Promise<Object>} Resultado paginado con los comentarios.
 */
const getModelComments = async (
    modelId,
    { page = 1, limit = 20 },
) => {
    const safeLimit = Math.min(limit, 50);
    const offset = (page - 1) * safeLimit;

    const [total, comments] = await prisma.$transaction([
        prisma.comments.count({
            where: { model_id: modelId },
        }),
        prisma.comments.findMany({
            where: { model_id: modelId },
            select: {
                id: true,
                content: true,
                created_at: true,
                updated_at: true,
                users: {
                    select: {
                        id: true,
                        profile: {
                            select: {
                                username: true,
                                avatar: true,
                            },
                        },
                    },
                },
            },
            orderBy: { created_at: "desc" },
            skip: offset,
            take: safeLimit,
        }),
    ]);

    const formattedData = comments.map((c) => ({
        id: c.id,
        content: c.content,
        created_at: c.created_at,
        updated_at: c.updated_at,
        author: {
            id: c.users?.id,
            username: c.users?.profile?.username || "Usuario Desconocido",
            avatar: c.users?.profile?.avatar || null,
        },
    }));

    return {
        page,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
        data: formattedData,
    };
};

/**
 * Actualiza el contenido de un comentario.
 * @param {string} commentId - ID del comentario.
 * @param {Object} user - Usuario que realiza la petición (para verificar permisos).
 * @param {string} content - Nuevo texto del comentario.
 * @returns {Promise<Object>} El comentario actualizado.
 */
const updateComment = async (commentId, user, content) => {
    const comment = await prisma.comments.findUnique({
        where: { id: commentId },
    });
    if (!comment)
        throw new Error("El comentario no existe");

    checkPermission(comment.user_id, user);

    const updatedComment = await prisma.comments.update({
        where: { id: commentId },
        data: { content, updated_at: new Date() },
        select: {
            id: true,
            content: true,
            created_at: true,
            updated_at: true,
        },
    });

    return updatedComment;
};

/**
 * Elimina un comentario.
 * @param {string} commentId - ID del comentario.
 * @param {Object} user - Usuario que realiza la petición.
 * @returns {Promise<Object>} Mensaje de éxito.
 */
const deleteComment = async (commentId, user) => {
    const comment = await prisma.comments.findUnique({
        where: { id: commentId },
    });
    if (!comment)
        throw new Error("El comentario no existe");

    checkPermission(comment.user_id, user);

    await prisma.comments.delete({
        where: { id: commentId },
    });

    return {
        message: "Comentario eliminado correctamente",
    };
};

/**
 * Crea una respuesta a un comentario existente.
 * Hereda automáticamente el model_id del comentario padre.
 * * @param {string} commentId - ID del comentario al que se va a responder (comentario padre).
 * @param {string} userId - ID del usuario que escribe la respuesta.
 * @param {string} content - Texto del contenido de la respuesta.
 * @returns {Promise<Object>} El nuevo comentario (respuesta) creado.
 */
const replyToComment = async (
    commentId,
    userId,
    content,
) => {
    const parentComment = await prisma.comments.findUnique({
        where: { id: commentId },
    });

    if (!parentComment)
        throw new Error("El comentario original no existe");

    const newReply = await prisma.comments.create({
        data: {
            user_id: userId,
            model_id: parentComment.model_id,
            parent_comment_id: commentId,
            content,
        },
        select: {
            id: true,
            user_id: true,
            model_id: true,
            parent_comment_id: true,
            content: true,
            created_at: true,
            updated_at: true,
        },
    });

    return newReply;
};

export {
    createComment,
    getModelComments,
    updateComment,
    deleteComment,
    replyToComment,
};
