import React, { useState } from 'react';
import useLikes from '../../hooks/useLike';

const LikeButton = ({ modelId, initialLikesCount }) => {
    const { likedModels, toggleLike } = useLikes();
    const isLiked = likedModels.has(modelId);

    const [localCount, setLocalCount] = useState(initialLikesCount);

    const handleLikeClick = (e) => {
        e.stopPropagation();
        toggleLike(e, modelId);
        setLocalCount(prev => isLiked ? prev - 1 : prev + 1);
    };

    return (
        <button
            onClick={handleLikeClick}
            className="flex items-center gap-1.5 text-sm font-bold transition-all hover:scale-110 group/like"
        >
            {isLiked ? (
                <>
                    <svg className="w-5 h-5 text-red-500 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                    <span className="text-red-500">{localCount}</span>
                </>
            ) : (
                <>
                    <svg className="w-5 h-5 text-gray-400 group-hover/like:text-red-500 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    <span className="text-gray-500 group-hover/like:text-red-500">{localCount}</span>
                </>
            )}
        </button>
    );
};

export default LikeButton;