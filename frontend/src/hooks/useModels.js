import React, { useContext } from "react";
//import { model } from "../contexts/ModelsContext.jsx";
import { model } from "../contexts/ModelsMeiliContext.jsx";

const useModels = () => {
    /**
     * Hook personalizado para consumir el contexto de la sesión de forma segura.
     * Lanza un error si se intenta usar fuera de su proveedor.
     */
    const contexto = useContext(model);

    if (!contexto) {
        throw new Error(
            "El hook useModels debe ser utilizado dentro de <ModelsContext.jsx>.",
        );
    }

    return contexto;
};

export default useModels;
