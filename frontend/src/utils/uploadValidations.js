const getFileSize = (fileOrArray) => {
    if (!fileOrArray) return 0;
    if (Array.isArray(fileOrArray)) return fileOrArray.reduce((acc, file) => acc + (file.size || 0), 0);
    return fileOrArray.size || 0;
};

const checkEmpty = (value) => !value?.trim();

const MAX_TOTAL_SIZE_BYTES = 50 * 1024 * 1024;

/**
 * Valida que el peso total de los archivos no supere los 50MB.
 */
export const validateFileSize = (files, t) => {
    const totalSize = getFileSize(files?.main_file) +
        getFileSize(files?.main_image) +
        getFileSize(files?.gallery) +
        getFileSize(files?.parts);

    if (totalSize > MAX_TOTAL_SIZE_BYTES) {
        const sizeMB = (totalSize / (1024 * 1024)).toFixed(1);
        return t('validations.upload.size_exceeded' + sizeMB + t('validations.upload.size_exceeded2'));
    }

    return null;
};

/**
 * Valida los datos y archivos requeridos del formulario.
 */
export const validateUploadData = ({ title }, { main_file, main_image }, isEditMode, t) => {
    if (checkEmpty(title)) {
        return t("uploadValidations.title_required");
    }

    if (!isEditMode) {
        if (!main_file) {
            return t("uploadValidations.main_file_required");
        }
        if (!main_image) {
            return t("uploadValidations.main_image_required");
        }
    }

    return null;
};