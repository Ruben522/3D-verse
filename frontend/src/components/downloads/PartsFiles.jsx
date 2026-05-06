import React from 'react';
import useModels from '../../hooks/useModels';
import Button from "../common/Button";
import { useTranslation } from 'react-i18next';

const PartsFiles = () => {
  const { currentModel, isDownloading, downloadPackage } = useModels();
  const { t } = useTranslation();
  const modelPartsList = currentModel?.parts || [];

  return (
    <div className="space-y-6 py-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 dark:border-gray-700 pb-4 transition-colors duration-300">
        <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">{t('downloads.parts_list')} ({modelPartsList.length})</p>
        <Button
          onClick={() => downloadPackage(currentModel.id, 'parts')}
          disabled={isDownloading}
          className="!px-5 !py-2.5 !text-sm !rounded-xl flex items-center gap-2 shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          {isDownloading ? t('downloads.compressing') : t('downloads.donwload_parts')}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {modelPartsList.map((part) => (
          <div key={part.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-colors duration-300 group">
            <div className="flex flex-col truncate pr-4">
              <span className="font-bold text-gray-800 dark:text-gray-200 text-base truncate transition-colors duration-300">{part.name}</span>
            </div>
            <a
              href={part.fileUrl}
              download
              className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-500/50 hover:bg-primary-50 dark:hover:bg-primary-900/30 text-sm font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              {t('downloads.download')}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartsFiles;