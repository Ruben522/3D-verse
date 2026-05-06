import React from 'react';
import useModels from '../../hooks/useModels';
import { useTranslation } from 'react-i18next';

const MainFile = () => {
  const { currentModel } = useModels();
  const { t } = useTranslation();

  return (
    <div className="py-6 animate-fade-in">
      {currentModel?.fileUrl ? (
        <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-primary-800/30 gap-4 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <div>
              <h3 className="font-bold text-primary-900 dark:text-primary-300 text-xl transition-colors duration-300">{t('downloads.main_model')}</h3>
              <p className="text-sm text-primary-600 dark:text-primary-400 mt-1 transition-colors duration-300">{t('downloads.main_model_desc')}</p>
            </div>
          </div>
          <a
            href={currentModel.fileUrl}
            download
            className="text-primary-700 dark:text-primary-400 bg-white dark:bg-gray-800 border border-primary-200 dark:border-primary-700 hover:bg-primary-600 dark:hover:bg-primary-500 hover:text-white dark:hover:text-white font-bold px-6 py-3 rounded-lg transition-all shadow-sm whitespace-nowrap"
          >
            {t('downloads.donwload_main')}
          </a>
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 py-10 transition-colors duration-300">{t('messages.no_model')}</p>
      )}
    </div>
  );
};

export default MainFile;