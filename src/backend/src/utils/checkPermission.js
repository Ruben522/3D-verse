const checkPermission = (resourceUserId, currentUser) => {
    if (resourceUserId !== currentUser.id && currentUser.role !== 'admin') {
        throw new Error("No autorizado para realizar esta acción");
    }
};

export {checkPermission};

// Uso en el servicio:
// checkPermission(model.user_id, currentUser);