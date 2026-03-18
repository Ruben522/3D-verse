import React, { useContext } from "react";
import { like } from "../contexts/LikeContext.jsx";

const useLike = () => {
    /**
     * Hook personalizado para consumir el contexto de la sesión de forma segura.
     * Lanza un error si se intenta usar fuera de su proveedor.
     */
    const contexto = useContext(like);

    if (!contexto) {
        throw new Error(
            "El hook useLike debe ser utilizado dentro de <ModelsContext.jsx>.",
        );
    }

    return contexto;
};

export default useLike;
