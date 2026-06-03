import React, { useEffect } from 'react';
import ModelCard from '../components/models/ModelCard';
import Pagination from '../components/common/Pagination';
import SearchBar from '../components/common/SearchBar';
import useModels from '../hooks/useModels';
import { useTranslation } from "react-i18next";
import InicialTittle from '../components/common/InicialTittle';
import Loading from '../components/common/Loading';
import EmptyModelsIcon from '../assets/icons/EmptyModelsIcon';
import EmptyState from '../components/common/EmptyState';

const Models = () => {
  const { t } = useTranslation();
  const {
    models, isFetchingModel, pagination, searchModels, searchTerm, setSearchTerm,
    activeCategory, setActiveCategory, sortBy, setSortBy, categoriasDisponibles, sortOptions, clearModelsSearch
  } = useModels();

  useEffect(() => {
    clearModelsSearch();
  }, [clearModelsSearch]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 py-12 px-4">
      <main className="max-w-7xl mx-auto pb-12">
        <div className="mb-12 text-center">
          <InicialTittle
            tittle={t('models_page.tittle')}
            subtittle={t('models_page.subtittle')}
          />
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onClear={() => setSearchTerm('')}
            placeholder={t('models_page.search_placeholder')}
            categories={categoriasDisponibles}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            sortOptions={sortOptions}
            activeSort={sortBy}
            onSortChange={setSortBy}
          />
        </div>

        {isFetchingModel && models.length === 0 ? (
          <Loading message={t('messages.loading')} />
        ) : (
          <div
            className={`transition-all duration-500
              ${isFetchingModel
                ? 'opacity-40 blur-[2px] pointer-events-none scale-[0.99]'
                : 'opacity-100 scale-100'
              }
            `}
          >
            {models.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {models.map((m) => (
                  <ModelCard key={m.id} model={m} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<EmptyModelsIcon />}
                title={t('models_page.no_results')}
                description={t('models_page.try_other_search')}
              />
            )}
          </div>
        )}

        {pagination.totalPages > 1 && !isFetchingModel && models.length > 0 && (
          <div className="mt-16 flex justify-center animate-fade-in">
            <Pagination
              totalPages={pagination.totalPages}
              currentPage={pagination.page}
              onPageChange={(p) => searchModels(searchTerm, p)}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Models;