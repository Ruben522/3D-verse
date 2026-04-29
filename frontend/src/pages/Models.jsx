import React, { useContext } from 'react';
import ModelCard from '../components/models/ModelCard';
import Pagination from '../components/common/Pagination';
import SearchBar from '../components/common/SearchBar';
import { model } from '../contexts/ModelsMeiliContext';
import { useTranslation } from "react-i18next";

const Models = () => {
  const { t } = useTranslation();
  const {
    models, isFetchingModel, pagination, searchModels,
    searchTerm, setSearchTerm,
    activeCategory, setActiveCategory,
    sortBy, setSortBy,
    categoriasDisponibles
  } = useContext(model);

  // Opciones de ordenación que le pasamos a la barra
  const sortOptions = [
    { value: "created_at:desc", label: "✨ Recientes" },
    { value: "likes_count:desc", label: "❤️ Populares" },
    { value: "downloads:desc", label: "📥 Descargas" },
  ];

  return (
    <div className="min-h-screen bg-surface py-12 px-4">
      <main className="max-w-7xl mx-auto pb-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            {t('explore.title')}
          </h1>
          <p className="text-gray-500 font-bold mb-10 text-lg">
            {t('explore.subtitle')}
          </p>

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

        {/* GRID DE MODELOS */}
        <div className={`transition-all duration-500 ${isFetchingModel ? 'opacity-40 blur-[2px] pointer-events-none scale-[0.99]' : 'opacity-100 scale-100'}`}>
          {models.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {models.map(m => <ModelCard key={m.id} model={m} />)}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100 max-w-3xl mx-auto shadow-sm">
              <span className="text-7xl mb-6 block drop-shadow-sm">🔎</span>
              <h3 className="text-2xl font-black text-gray-900 mb-2">No se encontraron modelos</h3>
              <p className="text-gray-500 font-bold">Intenta usar otros términos o elimina los filtros de categoría.</p>
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