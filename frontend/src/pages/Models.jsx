import React from 'react';
import ModelCard from '../components/models/ModelCard';
import useModels from '../hooks/useModels';

const Models = () => {
  const { models, isLoading, error } = useModels();

  return (
    <div className="min-h-screen bg-surface py-12 px-4 sm:px-6">
      <main className="max-w-7xl mx-auto px-6 pb-12 flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            </div>
          ) : error ? (
            <p className="text-red-500 font-medium">
              {error}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {models.map((model) => (
                <ModelCard key={model.id} model={model} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Models;