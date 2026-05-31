import React, { createContext, useState, useCallback } from "react";
import useAPI from "../hooks/useAPI";
import useMessage from "../hooks/useMessage";
import { useTranslation } from "react-i18next";

const commentsContext = createContext();

const CommentsContext = ({ children }) => {
    const api = useAPI();
    const { t } = useTranslation();
    const { showConfirm, showMessage } = useMessage();
    const backendUrl = import.meta.env.VITE_API_URL;

    const [comments, setComments] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentModelId, setCurrentModelId] = useState(null);

    const loadComments = useCallback(async (modelId, page = 1) => {
        setIsLoading(true);
        setCurrentModelId(modelId);
        try {
            const res = await api.get(`${backendUrl}/comments/model/${modelId}?page=${page}`);
            const data = res.data?.data || res.data || [];

            setComments(prev => page === 1 ? data : [...prev, ...data]);
            setPagination({
                page: res.data?.page,
                total: res.data?.total,
                totalPages: res.data?.totalPages,
            });
        } catch (error) {
            showMessage(t("comments_context.fetch_error"), "error");
        } finally {
            setIsLoading(false);
        }
    }, [api, backendUrl]);

    const rootComments = comments.filter(c => !c.parent_comment_id);
    const getReplies = (parentId) => comments.filter(c => c.parent_comment_id === parentId);

    const addComment = async (content) => {
        await api.post(`${backendUrl}/comments/${currentModelId}`, { content });
        await loadComments(currentModelId, 1);
    };

    const addReply = async (commentId, content) => {
        await api.post(`${backendUrl}/comments/${commentId}/reply`, { content });
        await loadComments(currentModelId, 1);
    };

    const editComment = async (commentId, content) => {
        await api.put(`${backendUrl}/comments/${commentId}`, { content });
        await loadComments(currentModelId, 1);
    };

    const deleteComment = async (commentId) => {
        showConfirm(t("comments_context.delete_confirmation"), async () => {
            try {
                await api.remove(`${backendUrl}/comments/${commentId}`);
                await loadComments(currentModelId, 1);
                showMessage(t("comments_context.delete_success"), "success");
            } catch (error) {
                showMessage(t("comments_context.delete_error"), "error");
            }
        });
    };

    const exportData = {
        comments,
        currentModelId,
        rootComments,
        pagination,
        isLoading,
        loadComments,
        getReplies,
        addComment,
        addReply,
        editComment,
        deleteComment
    };

    return (
        <commentsContext.Provider value={exportData}>
            {children}
        </commentsContext.Provider>
    );
};

export { commentsContext };
export default CommentsContext;