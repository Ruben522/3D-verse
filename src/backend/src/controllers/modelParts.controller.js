import {
    createPart,
    getParts,
    getPartsByModelId,
    deletePart,
} from "../services/modelParts.service.js";

const create = async (req, res) => {
    try {
        const { modelId } = req.params;
        const user = req.user;

        if (!req.files || req.files.length === 0) {
            return res
                .status(400)
                .json({
                    error: "Debe proporcionar al menos un archivo 3D",
                });
        }

        const uploadedParts = [];

        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];

            const fullPath = file.path.replace(/\\/g, "/");
            const uploadsIndex =
                fullPath.indexOf("/uploads/");
            const fileUrl =
                fullPath.substring(uploadsIndex);

            const part_name =
                file.originalname.split(".")[0];

            const data = {
                part_name: part_name,
                file_url: fileUrl,
                file_size: file.size,
                color: req.body.color || null,
            };

            const newPart = await createPart(
                user,
                modelId,
                data,
            );
            uploadedParts.push(newPart);
        }

        res.status(201).json({
            message: "Piezas añadidas correctamente",
            data: uploadedParts,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAll = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const parts = await getParts({ page, limit });
        res.status(200).json(parts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getByModel = async (req, res) => {
    try {
        const parts = await getPartsByModelId(
            req.params.modelId,
        );
        res.status(200).json(parts);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const result = await deletePart(
            req.params.id,
            req.user,
        );
        res.status(200).json(result);
    } catch (error) {
        res.status(403).json({ error: error.message });
    }
};

export { create, getAll, getByModel, remove };
