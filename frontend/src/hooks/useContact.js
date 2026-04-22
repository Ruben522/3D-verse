import React, { useContext } from "react";
import { contact } from "../contexts/ContactContext.jsx";

const useContact = () => {
    /**
     * Hook personalizado para consumir el contexto de la sesión de forma segura.
     * Lanza un error si se intenta usar fuera de su proveedor.
     */
    const contexto = useContext(contact);

    if (!contexto) {
        throw new Error(
            "El hook useContact debe ser utilizado dentro de <ContactContext.jsx>.",
        );
    }

    return contexto;
};

export default useContact;
