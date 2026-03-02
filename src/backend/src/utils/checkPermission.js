const checkPermission = (resourceOwnerId, currentUser) => {
    const isOwner = resourceOwnerId === currentUser.id;
    const isAdmin = currentUser.role === "admin";

    if (!isOwner && !isAdmin) {
        const error = new Error("No tienes permiso para realizar esta acción");
        error.status = 403;
        throw error;
    }
};

export { checkPermission };