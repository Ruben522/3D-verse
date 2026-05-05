import React, { useContext } from "react";
import { themeContext } from "../contexts/ThemeContext.jsx";

const useTheme = () => {
    /**
     * Hook personalizado para consumir el contexto de la sesión de forma segura.
     * Lanza un error si se intenta usar fuera de su proveedor.
     */
    const contexto = useContext(themeContext);

    if (!contexto) {
        throw new Error(
            "El hook useTheme debe ser utilizado dentro de <ThemeContext.jsx>.",
        );
    }

    return contexto;
};

export default useTheme;
