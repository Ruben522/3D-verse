const checkEmpty = (value) => !value?.trim();
const checkEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email?.trim());
const checkNoSpaces = (value) => /\s/.test(value?.trim());

/**
 * Valida los datos del formulario de inicio de sesión.
 */
export const validateLogin = ({ email, password }, t) => {
    if (checkEmpty(email) && checkEmpty(password)) return t('validations.login.empty_email_and_password', { defaultValue: 'Por favor, introduce tu correo y contraseña.' });
    if (checkEmpty(email)) return t('validations.login.empty_email', { defaultValue: 'El campo de correo electrónico no puede estar vacío.' });
    if (checkEmpty(password)) return t('validations.login.empty_password', { defaultValue: 'Por favor, introduce tu contraseña.' });
    if (!checkEmail(email)) return t('validations.login.invalid_email', { defaultValue: 'El formato del correo electrónico no es válido.' });
    if (password.length < 6) return t('validations.login.password_too_short', { defaultValue: 'La contraseña tiene que tener al menos 6 caracteres.' });

    return null;
};

/**
 * Valida los datos del formulario de registro.
 */
export const validateRegister = ({ name, username, email, password, confirmPassword }, t) => {
    if (checkEmpty(name) || checkEmpty(username) || checkEmpty(email) || checkEmpty(password)) {
        return t('validations.register.all_fields_required', { defaultValue: 'Todos los campos son obligatorios para registrarte.' });
    }

    if (username.trim().length < 3) return t('validations.register.username_too_short', { defaultValue: 'El nombre de usuario debe tener al menos 3 caracteres.' });
    if (checkNoSpaces(username)) return t('validations.register.username_has_spaces', { defaultValue: 'El nombre de usuario no puede contener espacios.' });
    if (!checkEmail(email)) return t('validations.register.invalid_email', { defaultValue: 'Por favor, introduce una dirección de correo válida.' });
    if (password.length < 6) return t('validations.register.password_too_short', { defaultValue: 'La contraseña debe tener al menos 6 caracteres.' });
    if (password !== confirmPassword) return t('validations.register.passwords_do_not_match', { defaultValue: 'Las contraseñas no coinciden.' });

    return null;
};

/**
 * Valida los datos al guardar la configuración del perfil.
 */
export const validateProfileUpdate = ({ username }, t) => {
    if (checkEmpty(username)) return t('validations.profile_update.username_empty', { defaultValue: 'El nombre de usuario no puede estar vacío.' });
    if (username.trim().length < 3) return t('validations.profile_update.username_too_short', { defaultValue: 'El nombre de usuario debe tener al menos 3 caracteres.' });
    if (checkNoSpaces(username)) return t('validations.profile_update.username_has_spaces', { defaultValue: 'El nombre de usuario no puede contener espacios.' });

    return null;
};