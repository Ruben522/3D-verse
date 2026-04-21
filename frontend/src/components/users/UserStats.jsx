import React from "react";
import { useTranslation } from "react-i18next";

const UserStats = ({ stats }) => {
  const { t } = useTranslation();

  return (
    <div className='bg-white rounded-3xl shadow-sm border border-gray-200 p-8 h-full'>
      <h3 className='text-lg font-extrabold text-gray-900 mb-6 border-b border-gray-100 pb-4'>
        <svg className='w-6 h-6 text-primary-500' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a２ ２ ０ ０１-２ -２z' />
        </svg>
        {t("activity")}
      </h3>

      <div className='space-y-4'>
        <div className='flex items-center justify-between p-4 bg-primary-50 rounded-2xl border border-primary-100 cursor-pointer'>
          <div className='flex items-center gap-3'>
            <span className='text-2xl'>🧊</span>
            <span className='font-bold text-primary-900'>
              {t("designs")}
            </span>
          </div>
          <span className='text-2xl font-black text-primary-600'>
            {stats?.total_models || 0}
          </span>
        </div>

        <div className='flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer'>
          <div className='flex items-center gap-3'>
            <span className='text-2xl'>⬇️</span>
            <span className='font-bold text-gray-700'>
              {t("downloads")}
            </span>
          </div>
          <span className='text-xl font-bold text-gray-500'>
            {stats?.total_downloads || 0}
          </span>
        </div>

        <div className='flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer'>
          <div className='flex items-center gap-3'>
            <span className='text-2xl'>👀</span>
            <span className='font-bold text-gray-700'>
              {t("views")}
            </span>
          </div>
          <span className='text-xl font-bold text-gray-500'>
            {stats?.total_views || 0}
          </span>
        </div>

        <div className='flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer'>
          <div className='flex items-center gap-3'>
            <span className='text-2xl'>👥</span>
            <span className='font-bold text-gray-700'>
              {t("followers")}
            </span>
          </div>
          <span className='text-xl font-bold text-gray-500'>
            {stats?.total_followers || 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserStats;
