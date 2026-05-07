import React, { useEffect, useState } from 'react';
import useComments from '../../hooks/useComments';
import useUsers from '../../hooks/useUsers';
import CommentItem from './CommentItem';

const CommentsSection = ({ modelId }) => {
    const { rootComments, isLoading, loadComments, addComment } = useComments();
    const { isAuthenticated, currentUser } = useUsers();

    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        if (modelId) loadComments(modelId, 1);
    }, [modelId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        await addComment(newComment);
        setNewComment("");
    };

    return (
        <div className="flex flex-col gap-6 animate-fade-in text-left">
            {isAuthenticated ? (
                <form onSubmit={handleSubmit} className="flex gap-4 p-1">
                    <img
                        src={currentUser?.avatarUrl || `https://ui-avatars.com/api/?name=${currentUser?.username}&background=random&color=fff`}
                        alt="Mi Avatar"
                        className="w-12 h-12 rounded-full object-cover border-2 border-primary-100 dark:border-primary-900"
                    />
                    <div className="flex-1 flex flex-col gap-2">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Añade un comentario a este modelo..."
                            className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-primary-500 outline-none transition-colors"
                            rows="2"
                        />
                        <div className="flex justify-end">
                            <button type="submit" disabled={!newComment.trim() || isLoading} className="px-6 py-2.5 font-bold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-md transition-all active:scale-95">
                                Publicar
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="text-center p-6 bg-primary-50 dark:bg-primary-900/20 rounded-2xl border border-primary-100 dark:border-primary-800/50">
                    <p className="font-medium text-primary-800 dark:text-primary-300">Inicia sesión para participar en la conversación.</p>
                </div>
            )}

            <div className="flex flex-col gap-4 mt-4">
                {(isLoading && rootComments.length === 0) ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400 font-medium animate-pulse">Cargando comentarios...</div>
                ) : rootComments.length > 0 ? (
                    rootComments.map(comment => <CommentItem key={comment.id} comment={comment} />)
                ) : (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        <span className="text-4xl block mb-3">💬</span>
                        <p className="font-medium">No hay comentarios aún. ¡Sé el primero en opinar!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentsSection;