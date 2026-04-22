import React from 'react';
import useModels from '../../hooks/useModels';
import { useTranslation } from 'react-i18next';

const MainFile = () => {
  const { currentModel } = useModels();
  const { t } = useTranslation();

  return (
    <div className="py-6 animate-fade-in">
      {currentModel?.fileUrl ? (
        <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-primary-50 rounded-xl border border-primary-100 gap-4">
          <div className="flex items-center gap-4">
            <div>
              <h3 className="font-bold text-primary-900 text-xl">{t('downloads.main_model')}</h3>
              <p className="text-sm text-primary-600 mt-1">{t('downloads.main_model_desc')}</p>
            </div>
          </div>
          <a
            href={currentModel.fileUrl}
            download
            className="text-primary-700 bg-white border border-primary-200 hover:bg-primary-600 hover:text-white font-bold px-6 py-3 rounded-lg transition-all shadow-sm whitespace-nowrap"
          >
            {t('downloads.donwload_main')}
          </a>
        </div>
      ) : (
        <p className="text-center text-gray-500 py-10">{t('messages.no_model')}</p>
      )}
    </div>
  );
};

export default MainFile;