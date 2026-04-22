import React from 'react';
import useModels from '../../hooks/useModels';
import Button from "../common/Button";
import { useTranslation } from 'react-i18next';

const ImagesFiles = () => {
  const { currentModel, isDownloading, downloadPackage } = useModels();
  const { t } = useTranslation();
  const imageList = currentModel ? [currentModel.imageUrl, ...(currentModel.gallery || [])].filter(Boolean) : [];

  return (
    <div className="space-y-6 py-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">{t('downloads.images')} ({imageList.length})</p>
        <Button
          onClick={() => downloadPackage(currentModel.id, 'gallery')}
          disabled={isDownloading}
          className="!px-5 !py-2.5 !text-sm !rounded-xl flex items-center gap-2 shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          {isDownloading ? t('downloads.compressing') : t('downloads.donwload_galery')}
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {imageList.map((imgUrl, index) => {
          return (
            <a
              key={index}
              href={imgUrl}
              download={`imagen_referencia_${index + 1}`}
              className="relative group aspect-square rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 shadow-sm block"
            >
              <img src={imgUrl} alt={`Galería ${index}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                <div className="bg-white/90 text-gray-900 p-3 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
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