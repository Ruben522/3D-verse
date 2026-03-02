import {
    createModel,
    getModelById,
    getModels,
    updateModel,
    deleteModel,
    downloadModel,
    addLike,
    removeLike,
} from "../services/models.service.js";

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

const download = async (req, res) => {
    try {
        const tokenUser = req.user || null;

        const ip = req.ip;
        const userAgent = req.headers["user-agent"];

        const result = await downloadModel(
            req.params.id,
            tokenUser,
            ip,
            userAgent,
        );

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
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

const formatUploadedFiles = (files, userId, folderName) => {
    if (
        !files ||
        !files["main_file"] ||
        !files["cover_image"]
    ) {
        throw new Error(
            "El archivo principal y la imagen de portada son obligatorios",
        );
    }

    const getUrl = (file) =>
        `/uploads/models/${userId}/${folderName}/${file.filename}`;

    const main_file = getUrl(files["main_file"][0]);
    const cover_image = getUrl(files["cover_image"][0]);

    const parts = (files["parts"] || []).map((file) => ({
        part_name: file.originalname.split(".")[0],
        file_url: getUrl(file),
        file_size: file.size,
    }));

    const gallery = (files["gallery"] || []).map((file) =>
        getUrl(file),
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

export {
    create,
    getById,
    getAll,
    update,
    remove,
    download,
    like,
    unlike,
    uploadModel,
};
