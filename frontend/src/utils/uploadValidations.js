export const validateUploadData = (formData, files) => {
    const errors = {};

    if (!formData.title || formData.title.trim() === "") {
        errors.title = "El título es obligatorio.";
    } else if (formData.title.length < 3) {
        errors.title = "El título debe tener al menos 3 caracteres.";
    }

    if (!files.main_file) {
        errors.main_file =
            "Debes subir un archivo 3D principal (.stl, .obj, etc).";
    }

    // Volvemos a hacer obligatoria la imagen
    if (!files.main_image) {
        errors.main_image = "La imagen de portada es obligatoria.";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};
