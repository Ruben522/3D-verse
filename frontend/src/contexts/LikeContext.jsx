import React, { createContext, useState, useEffect } from "react";
import useAPI from "../hooks/useAPI.js";
import useUsers from "../hooks/useUsers.js";

const like = createContext();

const LikeContext = ({ children }) => {
    const { isAuthenticated, currentUser } = useUsers();
    const api = useAPI();
    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const [likedModels, setLikedModels] = useState(new Set());

    useEffect(() => {
        if (isAuthenticated && currentUser?.id) {
            cargarLikes();
        } else {
            setLikedModels(new Set());
        }
    }, [isAuthenticated, currentUser]);

    const cargarLikes = async () => {
        try {
            // Mapeado a users.routes.js -> router.get("/:userId/likes")
            const likesRes = await api.get(`${backendUrl}/users/${currentUser.id}/likes`);

            // Extraemos los datos dependiendo de cómo tu getLikes formatee el JSON
            const data = likesRes.data?.data || likesRes.data || likesRes || [];

            const likeIds = new Set();
            data.forEach(item => {
                if (item.model_id) likeIds.add(item.model_id);
                else if (item.model?.id) likeIds.add(item.model.id);
                else if (item.id) likeIds.add(item.id);
            });

            setLikedModels(likeIds);
        } catch (error) {
            console.error("Error al cargar los likes iniciales:", error);
        }
    };

    const toggleLike = async (e, modelId) => {
        if (e) e.preventDefault();
        if (!isAuthenticated) return alert("Debes iniciar sesión para dar me gusta");

        const isLiked = likedModels.has(modelId);

        // Actualización optimista
        setLikedModels(prev => {
            const next = new Set(prev);
            isLiked ? next.delete(modelId) : next.add(modelId);
            return next;
        });

        try {
            // Mapeado a models.routes.js -> router.post("/:id/like") y router.delete("/:id/like")
            if (isLiked) {
                await api.remove(`${backendUrl}/models/${modelId}/like`);
            } else {
                await api.post(`${backendUrl}/models/${modelId}/like`);
            }
        } catch (error) {
            // Revertir si el backend falla
            setLikedModels(prev => {
                const next = new Set(prev);
                isLiked ? next.add(modelId) : next.delete(modelId);
                return next;
            });
            console.error("Error al procesar el Like:", error);
        }
    };

    const exportData = { likedModels, toggleLike };

    return (
        <like.Provider value={exportData}>
            {children}
        </like.Provider>
    );
};

export { like };
export default LikeContext;