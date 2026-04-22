import React from 'react';
import { Link } from 'react-router-dom';
import useUsers from '../../hooks/useUsers';
import FollowButton from '../common/FollowButton';

const ProfileCard = ({ user }) => {
    const { checkIsOwnProfile, getProfileRoute } = useUsers();

    return (
        <Link
            to={getProfileRoute(user.id, user.username)}
            className="block group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:border-primary-200 hover:-translate-y-1 transition-all duration-300 relative"
        >
            {/* Banner */}
            <div
                className="h-24 w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={user.computedBannerStyle}
            />

            {/* BOTÓN DE SEGUIR (La lógica ya está en el Contexto y en el propio botón) */}
            {!checkIsOwnProfile(user.id) && (
                <FollowButton targetUserId={user.id} />
            )}

            {/* Contenido de la Tarjeta */}
            <div className="p-5 pt-0 flex flex-col items-center text-center relative z-10">

                {/* Avatar Flotante */}
                <div className="w-20 h-20 rounded-full border-4 border-white shadow-md -mt-10 overflow-hidden bg-white relative">
                    <img src={user.computedAvatar} alt={user.username} className="w-full h-full object-cover" />
                    {user.badge_url && (
                        <img src={user.badge_url} alt="Badge" className="absolute bottom-0 right-0 w-6 h-6" />
                    )}
                </div>

                {/* Info del Usuario */}
                <h3 className="font-bold text-lg text-gray-900 mt-3 truncate w-full group-hover:text-primary-600 transition-colors">
                    @{user.username}
                </h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2 min-h-[40px] px-2">
                    {user.bio || "Creador 3D en la plataforma."}
                </p>

                {/* Estadísticas */}
                <div className="flex items-center justify-center gap-8 w-full mt-5 pt-4 border-t border-gray-50">
                    <div className="flex flex-col items-center">
                        <span className="font-black text-gray-900 text-lg">{user.models_count || 0}</span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Modelos</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="font-black text-gray-900 text-lg">{user.followers_count || 0}</span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Seguidores</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProfileCard;