import React from "react";
import useModels from "../../hooks/useModels";

const ModelSidebar = () => {
  const { currentModel } = useModels();

  // Paleta de colores suaves para los tags (Fondo + Texto + Borde)
  const tagStyles = [
    "bg-amber-50 text-amber-700 border-amber-100",
    "bg-blue-50 text-blue-700 border-blue-100",
    "bg-emerald-50 text-emerald-700 border-emerald-100",
    "bg-rose-50 text-rose-700 border-rose-100",
    "bg-indigo-50 text-indigo-700 border-indigo-100",
    "bg-purple-50 text-purple-700 border-purple-100",
    "bg-cyan-50 text-cyan-700 border-cyan-100",
    "bg-orange-50 text-orange-700 border-orange-100"
  ];

  return (
    <aside className="w-full">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col gap-8">

        {/* SECCIÓN ESTADÍSTICAS */}
        <div>
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-5">Estadísticas de Uso</h3>
          <div className="grid grid-cols-1 gap-4">

            {/* Descargas */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/50 border border-gray-50 group hover:border-blue-100 hover:bg-blue-50/30 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                </div>
                <span className="text-sm font-bold text-gray-600">Descargas</span>
              </div>
              <span className="text-lg font-black text-gray-900 pr-2">{currentModel.downloads}</span>
            </div>

            {/* Likes */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/50 border border-gray-50 group hover:border-rose-100 hover:bg-rose-50/30 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>
                </div>
                <span className="text-sm font-bold text-gray-600">Favoritos</span>
              </div>
              <span className="text-lg font-black text-gray-900 pr-2">{currentModel.likes}</span>
            </div>

            {/* Vistas */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/50 border border-gray-50 group hover:border-emerald-100 hover:bg-emerald-50/30 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                </div>
                <span className="text-sm font-bold text-gray-600">Visitas</span>
              </div>
              <span className="text-lg font-black text-gray-900 pr-2">{currentModel.views}</span>
            </div>

          </div>
        </div>

        {/* SECCIÓN CATEGORÍAS */}
        {currentModel.categories?.length > 0 && (
          <div className="pt-2">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Categorías</h3>
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
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Etiquetas Relacionadas</h3>
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

      </div>
    </aside>
  );
};

export default ModelSidebar;