import React, { createContext, useState } from "react";
import { sendExternalEmail } from "../hooks/useMailService.js";

const contact = createContext();

const ContactContext = ({ children }) => {
    const creatorInfo = {
        name: "Rubén",
        role: "Full Stack Developer",
        bio: "Desarrollador apasionado por crear experiencias digitales únicas. Me encanta resolver problemas complejos y construir herramientas que aporten valor.",
        avatar: "https://ui-avatars.com/api/?name=Tu+Nombre&background=3b82f6&color=fff",
        history: "Todo empezó al darme cuenta de que las plataformas actuales de modelos 3D estaban estancadas. Decidí construir 3DVerse para crear una experiencia rápida, limpia y optimizada.",
        socials: {
            github: "https://github.com/tu-usuario",
            linkedin: "https://linkedin.com/in/tu-usuario",
            email: "rubiosax52@gmail.com"
        }
    };

    const formInicial = { name: '', email: '', subject: '', message: '' };
    const [formData, setFormData] = useState(formInicial);
    const [isSending, setIsSending] = useState(false);
    const [sendSuccess, setSendSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setIsSending(true);
        setSendSuccess(false);

        try {
            await sendExternalEmail(formData);
            setSendSuccess(true);
            setFormData(formInicial);
        } catch (error) {
            console.error("El contexto atrapó un error:", error);
        } finally {
            setIsSending(false);
        }
    };

    const exportData = {
        creatorInfo,
        formData,
        isSending,
        sendSuccess,
        handleChange,
        handleSubmit
    };

    return <contact.Provider value={exportData}>{children}</contact.Provider>;
};

export { contact };
export default ContactContext;