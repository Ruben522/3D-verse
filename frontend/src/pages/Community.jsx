import React from 'react';
import useUsers from '../hooks/useUsers';
import ProfileCard from '../components/users/ProfileCard';
import { useTranslation } from 'react-i18next';
import Pagination from '../components/common/Pagination';
import SearchBar from '../components/common/SearchBar'; // 🔥 Importamos la Omnibar

const Community = () => {
    const {
        communityUsers,
        searchCommunityUsers,
        isLoadingCommunity,
        isSearchingUsers,
        pagination,
        searchUserTerm,
        setSearchUserTerm,
        userSortBy,
        setUserSortBy
    } = useUsers();
    const { t } = useTranslation();

    // 🔥 Opciones de ordenación exclusivas para Creadores
    const sortOptions = [
        { value: "followers_count:desc", label: "🌟 Más Seguidores" },
        { value: "models_count:desc", label: "📦 Más Modelos" }
    ];

    return (
        <div className="min-h-screen bg-surface py-12 px-4 sm:px-6 pb-32">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
                        Comunidad de Creadores
                    </h1>
                    <p className="text-lg text-gray-500 font-medium mb-10 max-w-2xl mx-auto">
                        Descubre a los talentosos diseñadores 3D que forman parte de nuestra plataforma.
                    </p>

                    <SearchBar
                        value={searchUserTerm}
                        onChange={setSearchUserTerm}
                        onClear={() => setSearchUserTerm('')}
                        placeholder="Buscar por nombre de usuario o biografía..."
                        sortOptions={sortOptions}
                        activeSort={userSortBy}
                        onSortChange={setUserSortBy}
                    />
                </div>

                {/* Grid con desenfoque al buscar */}
                <div className={`transition-all duration-300 ${isSearchingUsers ? 'opacity-50 blur-sm scale-[0.98] pointer-events-none' : 'opacity-100'}`}>
                    {communityUsers?.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {communityUsers.map((user) => (
                                <ProfileCard key={user.id} user={user} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-3xl mx-auto">
                            <span className="text-6xl mb-4 block">🏜️</span>
                            <h3 className="text-2xl font-black text-gray-900">No hay creadores</h3>
                            <p className="text-gray-500 font-bold mt-2">Prueba a buscar otro nombre.</p>
                        </div>
                    )}
                </div>

                {!isLoadingCommunity && pagination.totalPages > 1 && (
                    <div className="mt-14 flex justify-center">
                        <Pagination
                            totalPages={pagination.totalPages}
                            currentPage={pagination.page}
                            onPageChange={(p) => searchCommunityUsers(searchUserTerm, p)}
                        />
                    </div>
                )}

            </div>
        </div>
    );
};

export default Community;