import React from "react";
import useModels from "../../hooks/useModels";
import useLikes from "../../hooks/useLike";
import useFavorites from "../../hooks/useFavorite";
import tagStyles from "../../utils/tagStyles";
import { useTranslation } from 'react-i18next';

const ModelSidebar = () => {
  const { currentModel } = useModels();
  const { t } = useTranslation();

  const { likedModels, toggleLike } = useLikes();
  const { favoritedModels, toggleFavorite } = useFavorites();

  const isLiked = likedModels.has(currentModel.id);
  const isSaved = favoritedModels.has(currentModel.id);

  return (
    <aside className="w-full">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col gap-8">

        {/* SECCIÓN ESTADÍSTICAS E INTERACCIONES */}
        <div>
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-5">{t("sidebar.stats_title")}</h3>
          <div className="grid grid-cols-1 gap-4">

            <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/50 border border-gray-50 hover:border-blue-100 hover:bg-blue-50/30 transition-all cursor-default">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                </div>
                <span className="text-sm font-bold text-gray-600">{t("sidebar.downloads")}</span>
              </div>
              <span className="text-lg font-black text-gray-900 pr-2">{currentModel.downloads}</span>
            </div>

            {/* Botón de Like interactivo */}
            <button
              onClick={(e) => toggleLike(e, currentModel.id)}
              className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all border group ${isLiked
                ? "bg-rose-50 border-rose-200 hover:bg-rose-100"
                : "bg-gray-50/50 border-gray-50 hover:border-rose-100 hover:bg-rose-50/30"
                }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg transition-all ${isLiked ? "bg-rose-600 shadow-rose-200 scale-105" : "bg-rose-500 shadow-rose-200 group-hover:scale-105"
                  }`}>
                  {isLiked ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"></path></svg>
                  )}
                </div>
                <span className={`text-sm font-bold ${isLiked ? "text-rose-700" : "text-gray-600"}`}>{t("sidebar.likes")}</span>
              </div>
              <span className={`text-lg font-black pr-2 ${isLiked ? "text-rose-700" : "text-gray-900"}`}>{currentModel.likes}</span>
            </button>

            {/* Botón de Guardar interactivo (Conectado a tu contexto) */}
            <button
              onClick={(e) => toggleFavorite(e, currentModel.id)}
              className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all border group ${isSaved
                ? "bg-amber-50 border-amber-200 hover:bg-amber-100"
                : "bg-gray-50/50 border-gray-50 hover:border-amber-100 hover:bg-amber-50/30"
                }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg transition-all ${isSaved ? "bg-amber-600 shadow-amber-200 scale-105" : "bg-amber-500 shadow-amber-200 group-hover:scale-105"
                  }`}>
                  {isSaved ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                  )}
                </div>
                <span className={`text-sm font-bold ${isSaved ? "text-amber-700" : "text-gray-600"}`}>{t("buttons.save")}</span>
              </div>
              <span className={`text-xs font-bold pr-2 ${isSaved ? "text-amber-600" : "text-gray-400"}`}>
                {isSaved ? t("buttons.saved") : t("buttons.save")}
              </span>
            </button>

            {/* Visitas (Informativo) */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/50 border border-gray-50 hover:border-emerald-100 hover:bg-emerald-50/30 transition-all cursor-default">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                </div>
                <span className="text-sm font-bold text-gray-600">{t("sidebar.views")}</span>
              </div>
              <span className="text-lg font-black text-gray-900 pr-2">{currentModel.views}</span>
            </div>

          </div>
        </div>

        {/* SECCIÓN CATEGORÍAS */}
        {currentModel.categories?.length > 0 && (
          <div className="pt-2">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">{t("sidebar.categorys")}</h3>
            <div className="flex flex-wrap gap-2">
              {currentModel.categories.map((category, i) => (
                <span
                  key={`cat-${i}`}
                  className="bg-primary-600 text-white text-[11px] font-black px-4 py-2 rounded-full shadow-sm shadow-primary-200"
                >
                  {category.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* SECCIÓN TAGS ALEATORIOS */}
        {currentModel.tags?.length > 0 && (
          <div className="pt-2">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">{t("sidebar.tags")}</h3>
            <div className="flex flex-wrap gap-2">
              {currentModel.tags.map((tag, i) => (
                <span
                  key={`tag-${i}`}
                  className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border transition-transform hover:scale-105 cursor-pointer ${tagStyles[i % tagStyles.length]}`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* FECHA DE CREACIÓN */}
        {currentModel.createdDate && (
          <div className="pt-2">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">{t("sidebar.publication_date")}</h3>
            <span className="text-sm text-gray-600">
              {new Date(currentModel.createdDate).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
    </aside>
  );
};

export default ModelSidebar;