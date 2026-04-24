import React from 'react';
import { InstantSearch, useHits, usePagination } from 'react-instantsearch';
import { searchClient } from '../services/meiliClient'; // Ajusta la ruta a donde creaste el cliente
import ModelCard from '../components/models/ModelCard';
import Pagination from '../components/common/Pagination';
import SearchBar from '../components/common/SearchBar'; // El componente que hicimos antes

// 1. COMPONENTE PARA LA CUADRÍCULA (Sustituye al map tradicional)
const CustomHits = () => {
  const { hits } = useHits(); // hits = los modelos que devuelve Meilisearch

  if (hits.length === 0) {
    return <p className="text-gray-500 font-medium">No se encontraron modelos.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {hits.map((hit) => (
        <ModelCard key={hit.id} model={hit} />
      ))}
    </div>
  );
};

// 2. COMPONENTE ADAPTADOR PARA TU PAGINACIÓN
const CustomPagination = () => {
  // Extraemos la lógica de paginación de Meilisearch
  const { nbPages, currentRefinement, refine } = usePagination();

  if (nbPages <= 1) return null;

  return (
    <Pagination
      totalPages={nbPages}
      currentPage={currentRefinement + 1} // Meilisearch empieza a contar páginas en 0
      onPageChange={(page) => refine(page - 1)} // Le restamos 1 para Meilisearch
    />
  );
};

// 3. TU PÁGINA PRINCIPAL
const Models = () => {

  return (
    <div className="min-h-screen bg-surface py-12 px-4 sm:px-6">
      <InstantSearch indexName="models" searchClient={searchClient}>

        <main className="max-w-7xl mx-auto px-6 pb-12 flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <div className="mb-8">
              <SearchBar />
            </div>
            <CustomHits />
            <div className="mt-8">
              <CustomPagination />
            </div>

          </div>
        </main>

      </InstantSearch>
    </div>
  );
};

export default Models;