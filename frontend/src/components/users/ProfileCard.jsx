import React from 'react';
import { Link } from 'react-router-dom';
import useUsers from '../../hooks/useUsers';
import FollowButton from '../common/FollowButton';
import TrashIcon from '../../assets/icons/TrashIcon';
import UserAvatarIcon from '../../assets/icons/UserAvatarIcon';
import { useTranslation } from 'react-i18next';

const ProfileCard = ({ user }) => {
    const { checkIsOwnProfile, getProfileRoute, isAdmin, eliminarUsuario } = useUsers();
    const { t } = useTranslation();

    const isOwn = checkIsOwnProfile(user.id);

    const handleDeleteClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        eliminarUsuario(user.id);
    };

    return (
        <Link
            to={getProfileRoute(user.id, user.username)}
            className="block group rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative bg-white dark:bg-gray-800"
        >
            {isAdmin && !isOwn && (
                <button
                    onClick={handleDeleteClick}
                    className="absolute top-3 right-3 z-20 w-9 h-9 flex items-center justify-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-md text-red-500 hover:text-red-700 border border-red-100 dark:border-red-900/30 hover:border-red-500 dark:hover:border-red-500 rounded-full shadow-sm hover:shadow-md transition-all duration-300"
                >
                    <TrashIcon className="w-5 h-5 shrink-0" />
                </button>
            )}

            <div
                className="h-24 w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={user.computedBannerStyle}
            />

            <div className="p-5 pt-0 flex flex-col items-center text-center relative z-10">
                <div className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-800 shadow-md -mt-10 overflow-hidden bg-white dark:bg-gray-800 relative transition-colors duration-300">

                    {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover" />
                    ) : (
                        <UserAvatarIcon username={user.username} className="w-full h-full text-2xl" />
                    )}
                    {user.badge_url && (
                        <img src={user.badge_url} alt="Badge" className="absolute bottom-0 right-0 w-6 h-6" />
                    )}
                </div>

                <h3 className="font-bold text-lg text-gray-900 dark:text-white mt-3 truncate w-full group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                    @{user.username}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 min-h-[40px] px-2 transition-colors duration-300">
                    {user.bio || "Creador 3D en la plataforma."}
                </p>

                <div className="flex items-center justify-center gap-8 w-full mt-5 pt-4 border-t border-gray-100 dark:border-gray-700 transition-colors duration-300">
                    <div className="flex flex-col items-center">
                        <span className="font-black text-gray-900 dark:text-white text-lg transition-colors duration-300">{user.models_count || 0}</span>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold transition-colors duration-300">{t('user.models')}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="font-black text-gray-900 dark:text-white text-lg transition-colors duration-300">{user.followers_count || 0}</span>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold transition-colors duration-300">{t('user.followers')}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProfileCard;