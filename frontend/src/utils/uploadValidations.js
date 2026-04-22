import i18n from "../i18n";

export const validateUploadData = (formData, files) => {
    const errors = {};

    if (!formData.title || formData.title.trim() === "") {
        errors.title = i18n.t("uploadValidations.title_required");
    }

    if (!files.main_file) {
        errors.main_file = i18n.t("uploadValidations.main_file_required");
    }

    if (!files.main_image) {
        errors.main_image = i18n.t("uploadValidations.main_image_required");
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};
