import {
    createModel,
    getModelById,
    getModels,
    updateModel,
    deleteModel,
    addLike,
    removeLike,
} from "../services/models.service.js";

const formatUploadedFiles = (files, userId, folderName) => {
    if (!files || !files["main_file"]) {
        throw new Error(
            "El archivo principal 3D es obligatorio",
        );
    }

    const baseUrl = `/uploads/models/${userId}/${folderName}`;

    const main_file = `${baseUrl}/${files["main_file"][0].filename}`;

    const cover_image = files["cover_image"]
        ? `${baseUrl}/${files["cover_image"][0].filename}`
        : null;

    const parts = (files["parts"] || []).map((file) => ({
        part_name: file.originalname.split(".")[0],
        file_url: `${baseUrl}/parts/${file.filename}`,
        file_size: file.size,
    }));

    const gallery = (files["gallery"] || []).map(
        (file) => `${baseUrl}/gallery/${file.filename}`,
    );

    return { main_file, cover_image, parts, gallery };
};

const uploadModel = async (req, res) => {
    try {
        const formattedFiles = formatUploadedFiles(
            req.files,
            req.user.id,
            req.currentFolder,
        );

        res.status(201).json({
            message:
                "Archivos subidos y clasificados correctamente",
            folder_used: req.currentFolder,
            ...formattedFiles,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const create = async (req, res) => {
    try {
        const model = await createModel(
            req.user.id,
            req.body,
        );

        res.status(201).json({
            message: "Modelo publicado con éxito",
            data: model,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getById = async (req, res) => {
    try {
        const model = await getModelById(req.params.id);
        res.status(200).json(model);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

const getAll = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const models = await getModels({ page, limit });
        res.status(200).json(models);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const model = await updateModel(
            req.params.id,
            req.user,
            req.body,
        );
        res.status(200).json(model);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const result = await deleteModel(
            req.params.id,
            req.user,
        );
        res.status(200).json(result);
    } catch (error) {
        res.status(403).json({ error: error.message });
    }
};

const like = async (req, res) => {
    try {
        const result = await addLike(
            req.params.id,
            req.user.id,
        );
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const unlike = async (req, res) => {
    try {
        const result = await removeLike(
            req.params.id,
            req.user.id,
        );
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export {
    create,
    getById,
    getAll,
    update,
    remove,
    like,
    unlike,
    uploadModel,
};
