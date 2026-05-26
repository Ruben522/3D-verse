import React from 'react';
import useModels from '../../hooks/useModels';
import { useTranslation } from 'react-i18next';

const DownloadAllButton = ({ className = "" }) => {
    const { currentModel, isDownloading, downloadPackage } = useModels();
    const { t } = useTranslation();

    return (
        <button
            onClick={() => downloadPackage(currentModel.id, 'all')}
            disabled={isDownloading}
            className={`
        flex items-center justify-center gap-3 px-8 py-4 
        bg-primary-600 hover:bg-primary-700 active:bg-primary-800 
        text-white font-bold text-base rounded-2xl 
        shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 
        transition-all duration-300 transform hover:-translate-y-0.5
        disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-primary-500/30
        ${className}
      `}
        >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            <span className="truncate">
                {isDownloading ? t('downloads.prepare_zip') : t('downloads.download_package')}
            </span>
        </button>
    );
};

export default DownloadAllButton;