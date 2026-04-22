export const sendExternalEmail = async (formData) => {
    const ACCESS_KEY = "c71b663f-728f-4b3b-a11b-dd426c0e6d1c";
    const API_URL = "https://api.web3forms.com/submit";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                access_key: ACCESS_KEY,
                name: formData.name,
                email: formData.email,
                subject: `3DVerse: ${formData.subject}`,
                message: formData.message,
            }),
        });

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || "Error en el servicio de correo");
        }

        return { success: true };
    } catch (error) {
        console.error("Error en mailService:", error);
        throw error;
    }
};
