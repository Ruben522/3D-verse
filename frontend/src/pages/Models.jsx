import React, { useContext } from 'react';
import ModelCard from '../components/models/ModelCard';
import Pagination from '../components/common/Pagination';
import SearchBar from '../components/common/SearchBar';
import { model } from '../contexts/ModelsMeiliContext';
import { useTranslation } from "react-i18next";

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
    categoriasDisponibles
  } = useContext(model);

  // Opciones de ordenación
  const sortOptions = [
    { value: "created_at:desc", label: "✨ Recientes" },
    { value: "likes_count:desc", label: "❤️ Populares" },
    { value: "downloads:desc", label: "📥 Descargas" },
  ];

  return (
    <div
      className="
        min-h-screen
        bg-gray-50 dark:bg-gray-900
        transition-colors duration-300
        py-12 px-4
      "
    >
      <main className="max-w-7xl mx-auto pb-12">

        {/* HEADER */}
        <div className="mb-12 text-center">

          <h1
            className="
              text-4xl md:text-5xl
              font-black tracking-tight
              text-gray-900 dark:text-zinc-100
              mb-4
              transition-colors
            "
          >
            {t('explore.title')}
          </h1>

          <p
            className="
              text-lg font-bold
              text-gray-500 dark:text-zinc-400
              mb-10
              transition-colors
            "
          >
            {t('explore.subtitle')}
          </p>

          {/* SEARCH */}
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onClear={() => setSearchTerm('')}
            placeholder="Buscar personajes, vehículos..."
            categories={categoriasDisponibles}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            sortOptions={sortOptions}
            activeSort={sortBy}
            onSortChange={setSortBy}
          />
        </div>

        {/* GRID */}
        <div
          className={`
            transition-all duration-500
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

            <div
              className="
                text-center py-20
                bg-white dark:bg-zinc-900
                rounded-3xl
                border-2 border-dashed
                border-gray-100 dark:border-zinc-800
                max-w-3xl mx-auto
                shadow-sm dark:shadow-black/20
                transition-colors duration-300
              "
            >
              <span className="text-7xl mb-6 block drop-shadow-sm">
                🔎
              </span>

              <h3
                className="
                  text-2xl font-black
                  text-gray-900 dark:text-zinc-100
                  mb-2
                  transition-colors
                "
              >
                No se encontraron modelos
              </h3>

              <p
                className="
                  text-gray-500 dark:text-zinc-400
                  font-bold
                  transition-colors
                "
              >
                Intenta usar otros términos o elimina los filtros de categoría.
              </p>
            </div>

          )}
        </div>

        {/* PAGINACIÓN */}
        {pagination.totalPages > 1 && (
          <div className="mt-16 flex justify-center">
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