/**
 * Verifica si el usuario actual tiene permiso para actuar sobre un recurso.
 * Permite la acción si el usuario es propietario o tiene rol de administrador.
 * Puedes extender la lógica agregando más condiciones en el futuro.
 *
 * @param {string} resourceOwnerId - ID del propietario del recurso
 * @param {Object} currentUser - Objeto del usuario autenticado
 * @param {string} currentUser.id - ID del usuario
 * @param {string} currentUser.role - Rol del usuario ("user", "admin", etc.)
 * @throws {Error} Con status 403 si no tiene permiso
 */
const checkPermission = (resourceOwnerId, currentUser) => {
    if (!currentUser) {
        const error = new Error("Usuario no autenticado.");
        error.status = 401;
        throw error;
    }

    const isOwner = String(resourceOwnerId) === String(currentUser.id);
    const isAdmin = currentUser.role === "admin";

    if (!isOwner && !isAdmin) {
        const error = new Error("No tienes permiso para realizar esta acción.");
        error.status = 403;
        throw error;
    }
};

export { checkPermission };
