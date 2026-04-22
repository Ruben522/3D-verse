import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ProfileModels = ({ models }) => {
  const { t } = useTranslation();

  return (
    <div className="py-6 animate-fade-in">
      {models && models.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {models.map(model => (
            <Link
              to={`/models/${model.id}`}
              key={model.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all group flex flex-col"
            >
              <div className="aspect-square bg-gray-100 overflow-hidden relative">
                {model.main_image_url ? (
                  <img
                    src={`http://localhost:3000${model.main_image_url}`}
                    alt={model.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-5xl bg-gray-50">🧊</div>
                )}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-gray-700 shadow-sm flex items-center gap-1">
                  ⬇️ {model.downloads}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <h3 className="font-extrabold text-gray-900 text-lg line-clamp-2 leading-tight mb-2 group-hover:text-primary-600 transition-colors">
                  {model.title}
                </h3>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
                  <span className="text-sm font-medium text-gray-500">👀 {model.views}</span>
                  <span className="text-sm font-bold text-red-500">❤️ {model._count?.model_likes || 0}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-200 border-dashed">
          <span className="text-6xl mb-4">🏜️</span>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{t("no_designs")}</h3>
        </div>
      )}
    </div>
  );
};

export default ProfileModels;