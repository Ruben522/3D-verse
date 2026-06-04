import React, { createContext, useState } from "react";
import { sendExternalEmail } from "../hooks/useMailService.js";
import { useTranslation } from "react-i18next";
import fotoPerfil from "../assets/images/fotojpg.jgp";

const contact = createContext();

const ContactContext = ({ children }) => {
    const { t } = useTranslation();
    const creatorInfo = {
        name: t("contact_context.name"),
        role: t("contact_context.role"),
        bio: t("contact_context.bio"),
        avatar: fotoPerfil,
        history: t("contact_context.history"),
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
            console.error(error);
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