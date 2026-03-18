import React, { useContext } from "react";
import { favorite } from "../contexts/FavoriteContext.jsx";

const useFavorite = () => {
    /**
     * Hook personalizado para consumir el contexto de la sesión de forma segura.
     * Lanza un error si se intenta usar fuera de su proveedor.
     */
    const contexto = useContext(favorite);

    if (!contexto) {
        throw new Error(
            "El hook useFavorite debe ser utilizado dentro de <ModelsContext.jsx>.",
        );
    }

    return contexto;
};

export default useFavorite;
