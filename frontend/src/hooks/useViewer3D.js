import React, { useContext } from "react";
import { viewer3d } from "../contexts/Viewer3DContext.jsx";

const useViewer3D = () => {
    /**
     * Hook personalizado para consumir el contexto de la sesión de forma segura.
     * Lanza un error si se intenta usar fuera de su proveedor.
     */
    const contexto = useContext(viewer3d);

    if (!contexto) {
        throw new Error(
            "El hook useViewer3D debe ser utilizado dentro de <Viewer3DContext.jsx>.",
        );
    }

    return contexto;
};

export default useViewer3D;
