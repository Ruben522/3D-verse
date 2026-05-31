import React, { createContext, useState, useEffect } from "react";
import useAPI from "../hooks/useAPI.js";
import useUsers from "../hooks/useUsers.js";
import useModels from "../hooks/useModels.js";
import { normalizeModelForCard } from "../utils/normalizers";
import { useTranslation } from "react-i18next";
import useMessage from "../hooks/useMessage.js";

const favoriteContext = createContext();

const FavoriteContext = ({ children }) => {
    const { isAuthenticated, currentUser } = useUsers();
    const { updateFavoritesCount } = useModels();
    const api = useAPI();
    const backendUrl = import.meta.env.VITE_API_URL;
    const { showMessage } = useMessage();
    const { t } = useTranslation();

    const [favoritedModels, setFavoritedModels] = useState(new Set());
    const [favoritesList, setFavoritesList] = useState([]);
    const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);

    const fetchFavoriteIds = async () => {
        if (!currentUser?.id) return;

        try {
            const favRes = await api.get(`${backendUrl}/users/${currentUser.id}/favorites`);
            const data = favRes.data || [];
            const favIds = new Set();

            data.forEach(item => {
                const id = item.model_id || item.model?.id || item.id;
                if (id) favIds.add(String(id));
            });

            setFavoritedModels(favIds);
        } catch (error) {
            showMessage(t("favorites_context.fetch_error"), "error");
        }
    };

    useEffect(() => {
        if (isAuthenticated && currentUser?.id) {
            fetchFavoriteIds();
        } else {
            setFavoritedModels(new Set());
            setFavoritesList([]);
        }
    }, [isAuthenticated, currentUser?.id]);

    const fetchFavorites = async (userId) => {
        setIsLoadingFavorites(true);
        try {
            const response = await api.get(`${backendUrl}/users/${userId}/favorites`);
            const data = response.data || [];

            setFavoritesList(data.map(model => normalizeModelForCard(model)));
        } catch (error) {
            showMessage(t("favorites_context.fetch_error"), "error");
        } finally {
            setIsLoadingFavorites(false);
        }
    };

    const updateLocalFavoriteState = (modelId, isFavoriting) => {
        updateFavoritesCount(modelId, isFavoriting);
        setFavoritedModels(prev => {
            const next = new Set(prev);
            isFavoriting ? next.add(modelId) : next.delete(modelId);
            return next;
        });
    };

    const syncFavoriteWithServer = async (modelId, isFavoriting) => {
        try {
            if (isFavoriting) {
                await api.post(`${backendUrl}/favorites/${modelId}`);
            } else {
                await api.remove(`${backendUrl}/favorites/${modelId}`);
            }
            return true;
        } catch (error) {
            return false;
        }
    };

    const toggleFavoriteModel = async (e, modelId) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (!isAuthenticated) {
            showMessage(t("favorites_context.auth_required"), "warning");
            return;
        }

        const safeId = String(modelId);
        const isCurrentlyFaved = favoritedModels.has(safeId);
        const targetState = !isCurrentlyFaved;

        updateLocalFavoriteState(safeId, targetState);

        const isSuccess = await syncFavoriteWithServer(safeId, targetState);

        if (!isSuccess) {
            updateLocalFavoriteState(safeId, isCurrentlyFaved);
            showMessage(t("favorites_context.toggle_error"), "error");
        }
    };

    const exportData = {
        favoritedModels,
        favoritesList,
        isLoadingFavorites,
        fetchFavorites,
        toggleFavoriteModel,
        favorites: favoritesList,
        getFavorites: fetchFavorites,
        toggleFavorite: toggleFavoriteModel
    };

    return (
        <favoriteContext.Provider value={exportData}>
            {children}
        </favoriteContext.Provider>
    );
};

export { favoriteContext as favorite };
export default FavoriteContext;