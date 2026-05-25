/**
 * Valida los datos del formulario de inicio de sesión.
 * @param {Object} datos - Objeto con email y password.
 * @returns {string|null} - Mensaje de error o null si es válido.
 */
export const validateLogin = ({ email, password }) => {
    // 1. Campos vacíos
    if (!email?.trim() && !password?.trim()) {
        return "Por favor, introduce tu correo y contraseña.";
    }
    if (!email?.trim()) {
        return "El campo de correo electrónico no puede estar vacío.";
    }
    if (!password?.trim()) {
        return "Por favor, introduce tu contraseña.";
    }

    // 2. Formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
        return "El formato del correo electrónico no es válido.";
    }

    // 3. Longitud mínima de contraseña (igual que en registro)
    if (password.length < 6) {
        return "La contraseña tiene que tener al menos 6 caracteres.";
    }

    return null;
};

/**
 * Valida los datos del formulario de registro.
 * @param {Object} datos - Objeto con name, username, email y password.
 * @returns {string|null} - Mensaje de error o null si es válido.
 */
export const validateRegister = ({ name, username, email, password }) => {
    if (!name?.trim() || !username?.trim() || !email?.trim() || !password?.trim()) {
        return "Todos los campos son obligatorios para registrarte.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
        return "Por favor, introduce una dirección de correo válida.";
    }

    if (password.length < 6) {
        return "La contraseña debe tener al menos 6 caracteres.";
    }

    if (/\s/.test(username.trim())) {
        return "El nombre de usuario no puede contener espacios.";
    }

    return null;
};