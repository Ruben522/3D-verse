import React, { createContext, useState, useEffect } from "react";
import useAPI from "../hooks/useAPI.js";
import useUsers from "../hooks/useUsers.js";
import { useTranslation } from "react-i18next";
import useMessage from "../hooks/useMessage.js";
import useModels from "../hooks/useModels.js";

const likeContext = createContext();

const LikeContext = ({ children }) => {
    const { isAuthenticated, currentUser } = useUsers();
    const { updateLikesCount } = useModels();
    const { t } = useTranslation();
    const { showMessage } = useMessage();
    const api = useAPI();
    const backendUrl = import.meta.env.VITE_API_URL;

    const [likedModels, setLikedModels] = useState(new Set());

    const fetchLikedModels = async () => {
        if (!currentUser?.id) return;

        try {
            const likesRes = await api.get(`${backendUrl}/users/${currentUser.id}/likes`);
            const data = likesRes.data?.data || likesRes.data || likesRes || [];

            const likeIds = new Set();
            data.forEach(item => {
                const id = item.model_id || item.model?.id || item.id;
                if (id) likeIds.add(String(id));
            });

            setLikedModels(likeIds);
        } catch (error) {
            showMessage(t("like_context.fetch_error"), "error");
        }
    };

    useEffect(() => {
        if (isAuthenticated && currentUser?.id) {
            fetchLikedModels();
        } else {
            setLikedModels(new Set());
        }
    }, [isAuthenticated, currentUser?.id]);

    const updateLocalLikeState = (modelId, isLiking) => {
        updateLikesCount(modelId, isLiking);
        setLikedModels(prev => {
            const next = new Set(prev);
            isLiking ? next.add(modelId) : next.delete(modelId);
            return next;
        });
    };

    const syncLikeWithServer = async (modelId, isLiking) => {
        try {
            if (isLiking) {
                await api.post(`${backendUrl}/models/${modelId}/like`);
            } else {
                await api.remove(`${backendUrl}/models/${modelId}/like`);
            }
            return true;
        } catch (error) {
            return false;
        }
    };

    const toggleLikeModel = async (e, modelId) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (!isAuthenticated) {
            showMessage(t("like_context.not_authenticated"), "warning");
            return;
        }

        const safeId = String(modelId);
        const isCurrentlyLiked = likedModels.has(safeId);
        const targetState = !isCurrentlyLiked;

        updateLocalLikeState(safeId, targetState);

        const isSuccess = await syncLikeWithServer(safeId, targetState);

        if (!isSuccess) {
            updateLocalLikeState(safeId, isCurrentlyLiked);
            showMessage(t("like_context.toggle_like_error"), "error");
        }
    };

    const exportData = {
        likedModels,
        toggleLikeModel,
        toggleLike: toggleLikeModel
    };

    return (
        <likeContext.Provider value={exportData}>
            {children}
        </likeContext.Provider>
    );
};

export { likeContext as like };
export default LikeContext;