import {
    createModel,
    getModelById,
    getModels,
    updateModel,
    deleteModel,
    addLike,
    removeLike,
} from "../services/models.service.js";

// FUNCIÓN DE FORMATEO (Usada en el Paso 1)
const formatUploadedFiles = (files, userId, folderName) => {
    // Solo exigimos el archivo principal
    if (!files || !files["main_file"]) {
        throw new Error(
            "El archivo principal 3D es obligatorio",
        );
    }

    const getUrl = (file) =>
        `/uploads/models/${userId}/${folderName}/${file.filename}`;

    const main_file = getUrl(files["main_file"][0]);

    // Imagen de portada opcional
    const cover_image = files["cover_image"]
        ? getUrl(files["cover_image"][0])
        : null;

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

// PASO 1: Subir archivos físicos y devolver URLs
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

// PASO 2: Guardar en Base de Datos
const create = async (req, res) => {
    try {
        // req.body ahora recibe el JSON final enviado por el Frontend/Postman
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
