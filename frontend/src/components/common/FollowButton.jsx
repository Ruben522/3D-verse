import React from 'react';
import useFollows from '../../hooks/useFollows';
import useUsers from '../../hooks/useUsers';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const FollowButton = ({ targetUserId }) => {
    const { followedUsers, toggleFollow } = useFollows();
    const { isAuthenticated } = useUsers();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const isFollowed = followedUsers.has(targetUserId);

    return (
        <button
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isAuthenticated) {
                    navigate('/login');
                    return;
                }
                toggleFollow(e, targetUserId);
            }}
            title={isFollowed ? "Dejar de seguir" : "Seguir usuario"}
            className={`absolute top-3 right-3 z-20 p-2.5 rounded-full backdrop-blur-md border shadow-sm transition-all duration-300 hover:scale-110 group/btn ${isFollowed
                ? 'bg-primary-500/90 border-primary-400 hover:bg-primary-600'
                : 'bg-black/20 hover:bg-black/40 border-white/30'
                }`}
        >
            {isFollowed ? (
                <svg className="w-5 h-5 text-white fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <polyline strokeLinecap="round" strokeLinejoin="round" points="17 11 19 13 23 9" />
                </svg>
            ) : (
                <svg className="w-5 h-5 text-white group-hover/btn:text-primary-400 fill-none stroke-current drop-shadow-md group-hover/btn:drop-shadow-none" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <line strokeLinecap="round" strokeLinejoin="round" x1="20" y1="8" x2="20" y2="14" />
                    <line strokeLinecap="round" strokeLinejoin="round" x1="23" y1="11" x2="17" y2="11" />
                </svg>
            )}
        </button>
    );
};

export default FollowButton;