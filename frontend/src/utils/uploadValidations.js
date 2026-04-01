export const validateUploadData = (formData, files) => {
    const errors = {};

    // 1. Validaciones de Textos (formData)
    if (!formData.title || formData.title.trim() === "") {
        errors.title = "El título es obligatorio.";
    } else if (formData.title.length < 3) {
        errors.title = "El título debe tener al menos 3 caracteres.";
    }

    if (!formData.description || formData.description.trim() === "") {
        errors.description = "La descripción es obligatoria.";
    }

    if (!formData.category_id) {
        errors.category_id = "Debes seleccionar una categoría.";
    }

    // 2. Validaciones de Archivos (files)
    if (!files.main_file) {
        errors.main_file =
            "Debes subir un archivo 3D principal (.stl, .obj, etc).";
    }

    if (!files.main_image) {
        errors.main_image = "La imagen de portada es obligatoria.";
    }

    // Retornamos isValid como true si el objeto errors está vacío
    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};
