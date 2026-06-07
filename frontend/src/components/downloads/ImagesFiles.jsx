import React from 'react';
import useModels from '../../hooks/useModels';
import { useTranslation } from 'react-i18next';

const ImagesFiles = () => {
  const { currentModel, isDownloading, downloadPackage } = useModels();
  const { t } = useTranslation();
  const imageList = currentModel ? [currentModel.imageUrl, ...(currentModel.gallery || [])].filter(Boolean) : [];

  return (
    <div className="space-y-6 py-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 dark:border-gray-700 pb-4 transition-colors duration-300">
        <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">
          {t('downloads.images')} ({imageList.length})
        </p>

        <button
          onClick={() => downloadPackage(currentModel.id, 'gallery')}
          disabled={isDownloading}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          {isDownloading ? t('downloads.compressing') : t('downloads.donwload_galery')}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {imageList.map((imgUrl, index) => {
          return (
            <a
              key={index}
              href={imgUrl.includes('supabase.co') ? `${imgUrl}?download=` : imgUrl}
              download={`imagen_referencia_${index + 1}`}
              className="relative group aspect-square rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 shadow-sm block transition-colors duration-300"
            >
              <img src={imgUrl} alt={`Galería ${index}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                <div className="bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white p-3 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg border border-gray-200 dark:border-gray-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default ImagesFiles;