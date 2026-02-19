import React, { useState, useEffect, useContext } from 'react';
import { ModelsContext } from "../context/ModelsContext";
import ModelCard from '../components/ModelCard';

const Modelos = () => {
  const { models, loading, error } = useContext(ModelsContext);
  
  return (
    <div className="min-h-screen bg-surface">
      
      {/* Cabecera */}
      <div className="bg-white border-b border-gray-200 mb-8">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Explorar Diseños
          </h1>

          <div className="flex gap-4 mt-4 text-sm font-medium text-gray-500 overflow-x-auto pb-2">
            <button className="px-4 py-2 bg-gray-900 text-white rounded-full">
              Populares
            </button>
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
              Nuevos
            </button>
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
              Destacados
            </button>
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
              Más valorados
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 pb-12 flex flex-col md:flex-row gap-8">
        <div className="flex-1">

          {
            loading ? (
              // Skeleton Loader
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* skeletons */}
              </div>
            ) : error ? (
              // Error simple y controlado
              <p className="text-red-500 font-medium">
                Error al cargar los modelos: {error}
              </p>
            ) : (
              // Modelos reales desde Supabase
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {models.map((modelo) => (
                  <ModelCard key={modelo.id} modelo={modelo} />
                ))}
              </div>
            )
          }

        </div>
      </main>
    </div>
  );
};

export default Modelos;