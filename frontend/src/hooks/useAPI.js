import { useState } from "react";

const useAPI = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = async (url, options = {}) => {
        setIsLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");

            const headers = {
                "Content-Type": "application/json",
                ...options.headers,
            };

            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const response = await fetch(url, {
                ...options,
                headers,
            });

            if (response.status === 401) {
                throw new Error("No autorizado. Inicia sesión de nuevo.");
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || data.message || "Error en la petición",
                );
            }

            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const get = (url) => request(url, { method: "GET" });
    const post = (url, body = {}) =>
        request(url, {
            method: "POST",
            body: JSON.stringify(body),
        });
    const put = (url, body) =>
        request(url, {
            method: "PUT",
            body: JSON.stringify(body),
        });
    const patch = (url, body) =>
        request(url, {
            method: "PATCH",
            body: JSON.stringify(body),
        });
    const remove = (url) => request(url, { method: "DELETE" });

    const postForm = async (url, formData) => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const headers = {};
            if (token) headers["Authorization"] = `Bearer ${token}`;

            const response = await fetch(url, {
                method: "POST",
                headers,
                body: formData,
            });
            if (response.status === 401)
                throw new Error("No autorizado. Inicia sesión.");

            const data = await response.json();
            if (!response.ok)
                throw new Error(data.message || "Error al subir archivos");
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const downloadFile = async (
    url,
    method,
    fileName,
    body = null,
) => {
    setIsLoading(true);
    setError(null);

    try {
        const token = localStorage.getItem("token");

        const headers = {
            ...(token && {
                Authorization: `Bearer ${token}`,
            }),
            ...(body &&
                method === "POST" && {
                    "Content-Type": "application/json",
                }),
        };

        const response = await fetch(url, {
            method,
            headers,
            ...(body &&
                method === "POST" && {
                    body: JSON.stringify(body),
                }),
        });

        if (response.status === 401) {
            throw new Error(
                "No autorizado. Inicia sesión.",
            );
        }

        if (!response.ok) {
            const errorData = await response
                .json()
                .catch(() => ({}));

            throw new Error(
                errorData.message ||
                    "Error al descargar el archivo",
            );
        }

        const blob = await response.blob();

        const objectUrl = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = objectUrl;
        link.download = fileName;

        link.click();

        URL.revokeObjectURL(objectUrl);
    } catch (err) {
        setError(err.message);
        throw err;
    } finally {
        setIsLoading(false);
    }
};

    const downloadPost = (url, fileName, body = {}) =>
        downloadFile(url, "POST", fileName, body);

    const downloadGet = (url, fileName) => downloadFile(url, "GET", fileName);
    return {
        isLoading,
        error,
        get,
        post,
        put,
        patch,
        remove,
        postForm,
        downloadPost,
        downloadGet,
    };
};

export default useAPI;
