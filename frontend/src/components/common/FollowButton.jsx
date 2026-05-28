import React from 'react';
import useFollows from '../../hooks/useFollows';
import useUsers from '../../hooks/useUsers';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PlusIcon from '../../assets/icons/PlusIcon';
import MinusIcon from '../../assets/icons/MinusIcon';

const FollowButton = ({ targetUserId, className = '' }) => {
    const { followedUsers, toggleFollow } = useFollows();
    const { isAuthenticated } = useUsers();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const safeId = String(targetUserId);
    const isFollowed = followedUsers.has(safeId);

    const handleFollowClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        toggleFollow(e, safeId);
    };

    const baseClasses = "flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold border rounded-xl transition-colors whitespace-nowrap";
    const followClasses = "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-primary-200 dark:border-primary-800 hover:bg-primary-100 dark:hover:bg-primary-900/40";
    const unfollowClasses = "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/40";

    return (
        <button
            onClick={handleFollowClick}
            className={`${baseClasses} ${isFollowed ? unfollowClasses : followClasses} ${className}`}
        >
            {isFollowed ? <MinusIcon className="w-5 h-5 -ml-1" /> : <PlusIcon className="w-5 h-5 -ml-1" />}

            {isFollowed
                ? t("user.unfollow", { defaultValue: "Dejar de seguir" })
                : t("user.follow", { defaultValue: "Seguir" })}
        </button>
    );
};

export default FollowButton;