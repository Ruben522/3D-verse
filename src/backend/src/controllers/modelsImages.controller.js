import {
    addImage,
    getModelImages,
    updateImageOrder,
    deleteImage,
} from "../services/modelsImages.service.js";

const uploadImage = async (req, res) => {
    try {
        const { modelId } = req.params;
        const { display_order } = req.body;
        const user = req.user;

        if (!req.file) {
            return res
                .status(400)
                .json({
                    error: "Debe proporcionar una imagen",
                });
        }

        const imageUrl = req.file.path.replace(/\\/g, "/");

        const newImage = await addImage(
            user,
            modelId,
            imageUrl,
            display_order || 0,
        );

        res.status(201).json(newImage);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getImages = async (req, res) => {
    try {
        const { modelId } = req.params;
        const images = await getModelImages(modelId);
        res.status(200).json(images);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { display_order } = req.body;
        const user = req.user;

        if (display_order === undefined) {
            return res
                .status(400)
                .json({
                    error: "El campo display_order es requerido",
                });
        }

        const updatedImage = await updateImageOrder(
            id,
            user,
            display_order,
        );
        res.status(200).json(updatedImage);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const removeImage = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        const response = await deleteImage(id, user);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export { uploadImage, getImages, updateOrder, removeImage };
