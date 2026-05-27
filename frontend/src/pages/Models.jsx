import React from 'react';
import ModelCard from '../components/models/ModelCard';
import Pagination from '../components/common/Pagination';
import SearchBar from '../components/common/SearchBar';
import useModels from '../hooks/useModels';
import { useTranslation } from "react-i18next";
import InicialTittle from '../components/common/InicialTittle';
import Loading from '../components/common/Loading';
import EmptyModelsIcon from '../assets/icons/EmptyModelsIcon';

const Models = () => {
  const { t } = useTranslation();

  const {
    models,
    isFetchingModel,
    pagination,
    searchModels,
    searchTerm,
    setSearchTerm,
    activeCategory,
    setActiveCategory,
    sortBy,
    setSortBy,
    categoriasDisponibles,
    sortOptions
  } = useModels();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 py-12 px-4">
      <main className="max-w-7xl mx-auto pb-12">
        <div className="mb-12 text-center">
          <InicialTittle
            tittle={t('explore.title')}
            subtittle={t('explore.subtitle')}
          />
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onClear={() => setSearchTerm('')}
            placeholder={t('messages.search_placeholder')}
            categories={categoriasDisponibles}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            sortOptions={sortOptions}
            activeSort={sortBy}
            onSortChange={setSortBy}
          />
        </div>

        {isFetchingModel && models.length === 0 ? (
          <Loading message={t('messages.loading_models', t('messages.loading'))} />
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

              <div className="
                  text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border-2 border-dashed
                  border-gray-100 dark:border-zinc-800 max-w-3xl mx-auto
                  shadow-sm dark:shadow-black/20 transition-colors duration-300"
              >
                <div className="flex justify-center mb-6">
                  <EmptyModelsIcon className="w-20 h-20 text-gray-300 dark:text-zinc-600 transition-colors" />
                </div>

                <h3 className="text-2xl font-black text-gray-900 dark:text-zinc-100 mb-2 transition-colors">
                  {t('messages.no_models_found')}
                </h3>

                <p className="text-gray-500 dark:text-zinc-400 font-bold transition-colors">
                  {t('messages.try_other_search')}
                </p>
              </div>

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