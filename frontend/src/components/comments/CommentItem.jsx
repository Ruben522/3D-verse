import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useUsers from '../../hooks/useUsers';
import useComments from '../../hooks/useComments';

const CommentItem = ({ comment }) => {
    const { currentUser, isAuthenticated } = useUsers();
    const { getReplies, deleteComment, editComment, addReply } = useComments();

    const [isEditing, setIsEditing] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [replyContent, setReplyContent] = useState("");

    const isAuthor = currentUser?.id === comment.author?.id;
    const authorAvatar = comment.author?.avatar || `https://ui-avatars.com/api/?name=${comment.author?.username}&background=random&color=fff`;

    const replies = getReplies(comment.id);

    return (
        <div className="flex flex-col gap-3 w-full">
            <div className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <Link to={`/perfil/${comment.author?.username}`} className="flex-shrink-0">
                    <img src={authorAvatar} alt={comment.author?.username} className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-600" />
                </Link>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                        <Link to={`/perfil/${comment.author?.username}`} className="font-bold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 truncate">
                            @{comment.author?.username}
                        </Link>
                        <span className="text-xs font-medium text-gray-400 dark:text-gray-500 flex-shrink-0">
                            {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                    </div>

                    {isEditing ? (
                        <div className="mt-2 animate-fade-in">
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-primary-500 outline-none"
                                rows="2"
                            />
                            <div className="flex justify-end gap-2 mt-2">
                                <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Cancelar</button>
                                <button onClick={async () => { await editComment(comment.id, editContent); setIsEditing(false); }} className="px-3 py-1.5 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors">Guardar</button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line break-words">
                            {comment.content}
                        </p>
                    )}

                    <div className="flex items-center gap-4 mt-3">
                        {isAuthenticated && !isEditing && (
                            <button onClick={() => setIsReplying(!isReplying)} className="text-xs font-bold text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                Responder
                            </button>
                        )}

                        {isAuthor && !isEditing && (
                            <>
                                <button onClick={() => setIsEditing(true)} className="text-xs font-bold text-gray-500 hover:text-blue-500 transition-colors">Editar</button>
                                <button onClick={() => deleteComment(comment.id)} className="text-xs font-bold text-gray-500 hover:text-red-500 transition-colors">Eliminar</button>
                            </>
                        )}
                    </div>

                    {isReplying && (
                        <div className="mt-4 flex gap-3 items-start animate-fade-in">
                            <img src={currentUser?.avatarUrl || `https://ui-avatars.com/api/?name=${currentUser?.username}&background=random&color=fff`} alt="Me" className="w-8 h-8 rounded-full flex-shrink-0 border border-gray-200 dark:border-gray-700" />
                            <div className="flex-1 flex gap-2">
                                <input
                                    type="text"
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    placeholder="Escribe una respuesta..."
                                    className="flex-1 px-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:border-primary-500 transition-colors"
                                />
                                <button onClick={async () => { await addReply(comment.id, replyContent); setIsReplying(false); setReplyContent(""); }} disabled={!replyContent.trim()} className="px-4 py-2 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors">
                                    Enviar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {replies.length > 0 && (
                <div className="ml-6 md:ml-12 pl-4 border-l-2 border-gray-200 dark:border-gray-700 flex flex-col gap-3">
                    {replies.map(reply => <CommentItem key={reply.id} comment={reply} />)}
                </div>
            )}
        </div>
    );
};

export default CommentItem;