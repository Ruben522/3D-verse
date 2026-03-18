import React, { useContext } from "react";
import { user } from "../contexts/UserContext.jsx";

const useUsers = () => {
    /**
     * Hook personalizado para consumir el contexto de la sesión de forma segura.
     * Lanza un error si se intenta usar fuera de su proveedor.
     */
    const contexto = useContext(user);

    if (!contexto) {
        throw new Error(
            "El hook useUsers debe ser utilizado dentro de <UserContext.jsx>.",
        );
    }

    return contexto;
};

export default useUsers;
