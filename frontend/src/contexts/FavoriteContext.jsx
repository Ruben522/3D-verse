import React, { createContext, useState, useEffect } from "react";
import useAPI from "../hooks/useAPI.js";
import useUsers from "../hooks/useUsers.js";
import { normalizeModelForCard } from "../utils/normalizers";

const favorite = createContext();

const FavoriteContext = ({ children }) => {
    const { isAuthenticated, currentUser } = useUsers();
    const api = useAPI();
    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const [favoritedModels, setFavoritedModels] = useState(new Set());
    const [favorites, setFavorites] = useState([]);
    const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);

    useEffect(() => {
        if (isAuthenticated && currentUser?.id) {
            cargarFavoritos();
        } else {
            setFavoritedModels(new Set());
            setFavorites([]);
        }
    }, [isAuthenticated, currentUser]);

    const cargarFavoritos = async () => {
        try {
            const favRes = await api.get(`${backendUrl}/users/${currentUser.id}/favorites`);
            const data = favRes.data?.data || favRes.data || favRes || [];

            const favIds = new Set();
            data.forEach(item => {
                if (item.id) favIds.add(item.id);
            });

            setFavoritedModels(favIds);
        } catch (error) {
            console.error("Error al cargar los favoritos del usuario:", error);
        }
    };

    const getFavorites = async (userId) => {
        setIsLoadingFavorites(true);
        try {
            const response = await api.get(`${backendUrl}/users/${userId}/favorites`);
            const data = response.data?.data || response.data || response || [];

            setFavorites(data.map(model => normalizeModelForCard(model)));
        } catch (error) {
            console.error("Error cargando la lista de favoritos:", error);
        } finally {
            setIsLoadingFavorites(false);
        }
    };

    const toggleFavorite = async (e, modelId) => {
        if (e) e.preventDefault();
        if (!isAuthenticated) return alert("Debes iniciar sesión para guardar modelos");

        const isFaved = favoritedModels.has(modelId);

        setFavoritedModels(prev => {
            const next = new Set(prev);
            isFaved ? next.delete(modelId) : next.add(modelId);
            return next;
        });

        try {
            if (isFaved) {
                await api.remove(`${backendUrl}/favorites/${modelId}`);
            } else {
                await api.post(`${backendUrl}/favorites/${modelId}`);
            }
        } catch (error) {
            setFavoritedModels(prev => {
                const next = new Set(prev);
                isFaved ? next.add(modelId) : next.delete(modelId);
                return next;
            });
            console.error("Error al procesar el Favorito:", error);
        }
    };

    const exportData = {
        favoritedModels,
        favorites,
        isLoadingFavorites,
        getFavorites,
        toggleFavorite
    };

    return (
        <favorite.Provider value={exportData}>
            {children}
        </favorite.Provider>
    );
};

export { favorite };
export default FavoriteContext;