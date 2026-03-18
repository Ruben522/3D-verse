import { useState } from "react";

const useAPI = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = async (url, options = {}) => {
        setIsLoading(true);
        setError(null);

        try {
            // 1. Buscamos el token
            const token = localStorage.getItem("token");

            // 2. Preparamos las cabeceras
            const headers = {
                "Content-Type": "application/json",
                ...options.headers,
            };

            // 3. ¡LA MAGIA! Si hay token, lo enviamos en formato Bearer
            if (token) {
                headers["Authorization"] =
                    `Bearer ${token}`;
            }

            // 4. Hacemos la petición
            const response = await fetch(url, {
                ...options,
                headers,
            });

            if (response.status === 401) {
                throw new Error(
                    "No autorizado. Inicia sesión de nuevo.",
                );
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Error en la petición",
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
    const remove = (url) =>
        request(url, { method: "DELETE" });

    return {
        isLoading,
        error,
        get,
        post,
        put,
        patch,
        remove,
    };
};

export default useAPI;
