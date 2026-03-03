import {
    addImage,
    getModelImages,
    updateImageOrder,
    deleteImage,
} from "../services/modelsImages.service.js";

const uploadImage = async (req, res) => {
    try {
        const { modelId } = req.params;
        const user = req.user;

        if (!req.files || req.files.length === 0) {
            return res
                .status(400)
                .json({
                    error: "Debe proporcionar al menos una imagen",
                });
        }

        const uploadedImages = [];
        let baseOrder =
            parseInt(req.body.display_order) || 0;

        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];

            const fullPath = file.path.replace(/\\/g, "/");
            const uploadsIndex =
                fullPath.indexOf("/uploads/");
            const imageUrl =
                fullPath.substring(uploadsIndex);

            const newImage = await addImage(
                user,
                modelId,
                imageUrl,
                baseOrder + i,
            );

            uploadedImages.push(newImage);
        }

        res.status(201).json({
            message: "Imágenes subidas correctamente",
            data: uploadedImages,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getImages = async (req, res) => {
    try {
        const images = await getModelImages(
            req.params.modelId,
        );
        res.status(200).json(images);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { display_order } = req.body;

        if (display_order === undefined) {
            return res
                .status(400)
                .json({
                    error: "El campo display_order es requerido",
                });
        }

        const updatedImage = await updateImageOrder(
            id,
            req.user,
            display_order,
        );
        res.status(200).json(updatedImage);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const removeImage = async (req, res) => {
    try {
        const response = await deleteImage(
            req.params.id,
            req.user,
        );
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export { uploadImage, getImages, updateOrder, removeImage };
