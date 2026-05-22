import React, { useContext } from "react";
import { category } from "../contexts/CategoryContext.jsx";

const useCategories = () => {
    /**
     * Hook personalizado para consumir el contexto de la sesión de forma segura.
     * Lanza un error si se intenta usar fuera de su proveedor.
     */
    const contexto = useContext(category);

    if (!contexto) {
        throw new Error(
            "El hook useFavorite debe ser utilizado dentro de <CategoryContext.jsx>.",
        );
    }

    return contexto;
};

export default useCategories;
