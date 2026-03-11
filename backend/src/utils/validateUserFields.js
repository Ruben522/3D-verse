/**
 * Valida los campos de un usuario durante registro o actualización.
 * Lanza un error con todos los mensajes concatenados si alguna validación falla.
 *
 * @param {Object} fields - Campos a validar
 * @param {boolean} [isUpdate=false] - true si es actualización (campos opcionales)
 * @throws {Error} Si hay errores de validación
 */
const validateUserFields = (fields, isUpdate = false) => {
    const errors = [];

    // Helper para añadir error solo si el campo está presente o es obligatorio
    const addError = (condition, message) => {
        if (condition) errors.push(message);
    };

    // username
    addError(
        !isUpdate && !fields.username?.trim(),
        "El nombre de usuario es obligatorio.",
    );
    addError(
        fields.username?.trim() &&
            fields.username.trim().length < 3,
        "El nombre de usuario debe tener al menos 3 caracteres.",
    );

    // name
    addError(
        !isUpdate && !fields.name?.trim(),
        "El nombre es obligatorio.",
    );
    addError(
        fields.name?.trim() &&
            fields.name.trim().length < 3,
        "El nombre debe tener al menos 3 caracteres.",
    );
    addError(
        fields.name?.trim() &&
            /\d/.test(fields.name.trim()),
        "El nombre no puede contener números.",
    );

    // email
    addError(
        !isUpdate && !fields.email?.trim(),
        "El correo electrónico es obligatorio.",
    );
    addError(
        fields.email?.trim() &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                fields.email.trim(),
            ),
        "El correo electrónico no tiene un formato válido.",
    );

    // password (solo relevante en registro por ahora)
    addError(
        !isUpdate && !fields.password?.trim(),
        "La contraseña es obligatoria.",
    );
    addError(
        fields.password?.trim() &&
            fields.password.trim().length < 6,
        "La contraseña debe tener al menos 6 caracteres.",
    );

    if (errors.length > 0) {
        throw new Error(errors.join(" "));
    }
};

export { validateUserFields };
