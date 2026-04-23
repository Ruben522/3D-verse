import { useContext } from "react";
import { message } from "../contexts/MessageContext";
/**
 * Hook personalizado para consumir el contexto de la sesión de forma segura.
 * Lanza un error si se intenta usar fuera de su proveedor.
 */
const useMessage = () => {
    const context = useContext(message);
    if (!context) {
        throw new Error("useMessage debe usarse dentro de un MessageProvider");
    }
    return context;
};

export default useMessage;
