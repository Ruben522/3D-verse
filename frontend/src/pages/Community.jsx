import React from 'react';
import useUsers from '../hooks/useUsers';
import ProfileCard from '../components/users/ProfileCard';
import { useTranslation } from 'react-i18next';
import Pagination from '../components/common/Pagination';
import SearchBar from '../components/common/SearchBar';
import InicialTittle from '../components/common/InicialTittle';
import EmptyCreatorsIcon from '../assets/icons/EmptyCreatorsIcon';

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
        setUserSortBy,
        sortOptions
    } = useUsers();
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 py-12 px-4 sm:px-6 pb-32">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12 animate-fade-in">
                    <InicialTittle
                        tittle={t('Comunidad de Creadores')}
                        subtittle={t('Descubre a los talentosos diseñadores 3D que forman parte de nuestra plataforma.')}
                    />

                    <SearchBar
                        value={searchUserTerm}
                        onChange={setSearchUserTerm}
                        onClear={() => setSearchUserTerm('')}
                        placeholder={t('Buscar por nombre de usuario o biografía...')}
                        sortOptions={sortOptions}
                        activeSort={userSortBy}
                        onSortChange={setUserSortBy}
                    />
                </div>

                <div className={`transition-all duration-300 ${isSearchingUsers ? 'opacity-50 blur-sm scale-[0.98] pointer-events-none' : 'opacity-100'}`}>
                    {communityUsers?.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {communityUsers.map((user) => (
                                <ProfileCard key={user.id} user={user} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border-2 border-dashed border-gray-100 dark:border-zinc-800 max-w-3xl mx-auto shadow-sm dark:shadow-black/20 transition-colors duration-300">

                            <div className="flex justify-center mb-6">
                                <EmptyCreatorsIcon className="w-20 h-20 text-gray-300 dark:text-zinc-600 transition-colors" />
                            </div>

                            <h3 className="text-2xl font-black text-gray-900 dark:text-zinc-100 mb-2 transition-colors">
                                {t('No hay creadores')}
                            </h3>

                            <p className="text-gray-500 dark:text-zinc-400 font-bold transition-colors">
                                {t('Prueba a buscar otro nombre o limpiar los filtros.')}
                            </p>
                        </div>
                    )}
                </div>

                {!isLoadingCommunity && pagination.totalPages > 1 && (
                    <div className="mt-14 flex justify-center animate-fade-in">
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