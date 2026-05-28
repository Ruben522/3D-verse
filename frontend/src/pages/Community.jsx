import React, { useEffect } from 'react';
import useUsers from '../hooks/useUsers';
import ProfileCard from '../components/users/ProfileCard';
import { useTranslation } from 'react-i18next';
import Pagination from '../components/common/Pagination';
import SearchBar from '../components/common/SearchBar';
import InicialTittle from '../components/common/InicialTittle';
import EmptyCreatorsIcon from '../assets/icons/EmptyCreatorsIcon';
import EmptyState from '../components/common/EmptyState';

const Community = () => {
    const {
        communityUsers, searchCommunityUsers, isLoadingCommunity, isSearchingUsers,
        pagination, searchUserTerm, setSearchUserTerm, userSortBy, setUserSortBy, sortOptions, clearCommunitySearch
    } = useUsers();
    const { t } = useTranslation();

    useEffect(() => {
        clearCommunitySearch();
    }, [clearCommunitySearch]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 py-12 px-4 sm:px-6 pb-32">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12 animate-fade-in">
                    <InicialTittle
                        tittle={t('community.tittle')}
                        subtittle={t('community.subtittle')}
                    />
                    <SearchBar
                        value={searchUserTerm}
                        onChange={setSearchUserTerm}
                        onClear={() => setSearchUserTerm('')}
                        placeholder={t('community.search_placeholder')}
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
                        <EmptyState
                            icon={<EmptyCreatorsIcon />}
                            title={t('community.no_results')}
                            description={t('community.try_other_search')}
                        />
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