import {
    createComment,
    getModelComments,
    updateComment,
    deleteComment
} from "../services/comments.service.js";

const create = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content || content.trim() === "") {
            return res.status(400).json({ error: "El comentario no puede estar vacío" });
        }

        const comment = await createComment(
            req.params.modelId,
            req.user.id,
            content.trim()
        );

        res.status(201).json(comment);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getByModel = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const comments = await getModelComments(
            req.params.modelId,
            { page, limit }
        );

        res.status(200).json(comments);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content || content.trim() === "") {
            return res.status(400).json({ error: "El comentario no puede estar vacío" });
        }

        const updated = await updateComment(
            req.params.commentId,
            req.user,
            content.trim()
        );

        res.status(200).json(updated);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const result = await deleteComment(
            req.params.commentId,
            req.user
        );

        res.status(200).json(result);

    } catch (error) {
        res.status(403).json({ error: error.message });
    }
};

export {
    create,
    getByModel,
    update,
    remove
};