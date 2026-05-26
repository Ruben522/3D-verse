import React from 'react';
import useModels from '../../hooks/useModels';
import { useTranslation } from 'react-i18next';

const MainFile = () => {
  const { currentModel } = useModels();
  const { t } = useTranslation();

  return (
    <div className="py-6 animate-fade-in">
      {currentModel?.fileUrl ? (
        <div className="flex flex-col sm:flex-row items-center justify-between p-5 sm:p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 gap-4 transition-colors duration-300 group">

          <div className="flex flex-col gap-1 pr-4 w-full">
            <h3 className="font-bold text-gray-800 dark:text-gray-200 text-lg transition-colors duration-300">
              {t('downloads.main_model')}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
              {t('downloads.main_model_desc')}
            </p>
          </div>

          <a
            href={currentModel.fileUrl}
            download
            className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-500/50 hover:bg-primary-50 dark:hover:bg-primary-900/30 text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm w-full sm:w-auto flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            {t('downloads.donwload_main')}
          </a>

        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 py-10 transition-colors duration-300">
          {t('messages.no_model')}
        </p>
      )}
    </div>
  );
};

export default MainFile;