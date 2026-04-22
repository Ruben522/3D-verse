import React, { useEffect } from 'react';
import useUsers from '../hooks/useUsers';
import ProfileCard from '../components/users/ProfileCard';
import { useTranslation } from 'react-i18next';

const Community = () => {
    const { communityUsers, getCommunityUsers, isLoadingCommunity } = useUsers();
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-surface py-12 px-4 sm:px-6 pb-32">
            <div className="max-w-7xl mx-auto">

                {/* Cabecera */}
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                        Comunidad de Creadores
                    </h1>
                    <p className="text-lg text-gray-500 font-medium mt-4 max-w-2xl mx-auto">
                        Descubre a los talentosos diseñadores 3D que forman parte de nuestra plataforma, explora sus modelos y únete a ellos.
                    </p>
                </div>

                {/* Contenido (Cargando o Grid de Usuarios) */}
                {isLoadingCommunity ? (
                    <div className="flex flex-col justify-center items-center min-h-[40vh]">
                        <span className="text-5xl animate-bounce mb-6">👥</span>
                        <p className="text-gray-500 font-bold text-xl">Cargando creadores...</p>
                    </div>
                ) : communityUsers?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
                        {communityUsers.map((user) => (
                            <ProfileCard key={user.id} user={user} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm animate-fade-in">
                        <span className="text-5xl grayscale opacity-50 mb-4 block">🏜️</span>
                        <h3 className="text-xl font-bold text-gray-900">Aún no hay creadores</h3>
                        <p className="text-gray-500 mt-2">Parece que la comunidad está empezando a formarse.</p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Community;