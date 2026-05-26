import React from 'react';
import { useTranslation } from 'react-i18next';
import DownloadAllButton from '../common/DownloadAllButton';

const AllFiles = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-10 space-y-6 animate-fade-in bg-gray-50/50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-700 mt-2 transition-colors duration-300">

      <p className="text-gray-500 dark:text-gray-400 text-center max-w-md font-medium leading-relaxed px-4 transition-colors duration-300">
        {t('downloads.download_desc')}
      </p>

      <DownloadAllButton />

    </div>
  );
};

export default AllFiles;