// Funciones de ayuda (igual que tus checkEmpty, checkEmail, etc.)
const getFileSize = (fileOrArray) => {
    if (!fileOrArray) return 0;
    if (Array.isArray(fileOrArray)) return fileOrArray.reduce((acc, file) => acc + (file.size || 0), 0);
    return fileOrArray.size || 0;
};

const checkEmpty = (value) => !value?.trim();

const MAX_TOTAL_SIZE_BYTES = 90 * 1024 * 1024; // 90MB

/**
 * Valida que el peso total de los archivos no supere los 90MB.
 */
export const validateFileSize = (files, t) => {
    const totalSize = getFileSize(files?.main_file) +
        getFileSize(files?.main_image) +
        getFileSize(files?.gallery) +
        getFileSize(files?.parts);

    if (totalSize > MAX_TOTAL_SIZE_BYTES) {
        const sizeMB = (totalSize / (1024 * 1024)).toFixed(1);
        return t('validations.upload.size_exceeded', {
            defaultValue: `Límite superado: Tus archivos pesan ${sizeMB}MB. El máximo es 90MB.`
        });
    }

    return null;
};

/**
 * Valida los datos y archivos requeridos del formulario.
 */
export const validateUploadData = ({ title }, { main_file, main_image }, isEditMode, t) => {
    if (checkEmpty(title)) {
        return t("uploadValidations.title_required", { defaultValue: "El título es obligatorio." });
    }

    if (!isEditMode) {
        if (!main_file) {
            return t("uploadValidations.main_file_required", { defaultValue: "El archivo principal 3D es obligatorio." });
        }
        if (!main_image) {
            return t("uploadValidations.main_image_required", { defaultValue: "La imagen de portada es obligatoria." });
        }
    }

    return null;
};