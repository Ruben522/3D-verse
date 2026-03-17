import React from "react";

const UserStats = ({ stats }) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 h-full">
      <h3 className="text-lg font-extrabold text-gray-900 mb-6 border-b border-gray-100 pb-4">
        📊 Actividad
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-primary-50 rounded-2xl border border-primary-100 cursor-pointer">
          <div className="flex items-center gap-3"><span className="text-2xl">🧊</span><span className="font-bold text-primary-900">Creaciones</span></div>
          <span className="text-2xl font-black text-primary-600">{stats?.total_models || 0}</span>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer">
          <div className="flex items-center gap-3"><span className="text-2xl">⬇️</span><span className="font-bold text-gray-700">Descargas</span></div>
          <span className="text-xl font-bold text-gray-500">{stats?.total_downloads || 0}</span>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer">
          <div className="flex items-center gap-3"><span className="text-2xl">👀</span><span className="font-bold text-gray-700">Visualizaciones</span></div>
          <span className="text-xl font-bold text-gray-500">{stats?.total_views || 0}</span>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer">
          <div className="flex items-center gap-3"><span className="text-2xl">👥</span><span className="font-bold text-gray-700">Seguidores</span></div>
          <span className="text-xl font-bold text-gray-500">{stats?.total_followers || 0}</span>
        </div>
      </div>
    </div>
  );
};

export default UserStats;