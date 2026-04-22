import React, { useContext } from "react";
import { follow } from "../contexts/FollowContext.jsx";

const useFollows = () => {
    /**
     * Hook personalizado para consumir el contexto de la sesión de forma segura.
     * Lanza un error si se intenta usar fuera de su proveedor.
     */
    const contexto = useContext(follow);

    if (!contexto) {
        throw new Error(
            "El hook useFollows debe ser utilizado dentro de <FollowContext.jsx>.",
        );
    }

    return contexto;
};

export default useFollows;
