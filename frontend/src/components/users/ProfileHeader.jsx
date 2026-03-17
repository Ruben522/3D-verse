import React from 'react';
import Button from '../common/Button';

const ProfileHeader = ({ profile, stats, isOwnProfile, cerrarSesion }) => {
  // ÚNICO RETURN
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden mb-8">
      
      {/* 1. Banner Superior (Imagen de portada o gradiente) */}
      <div className="h-48 md:h-64 w-full bg-gradient-to-r from-primary-800 via-primary-600 to-primary-900 relative">
        {/* Aquí en el futuro puedes pintar profile.customization.banner_url */}
      </div>

      {/* 2. Área Principal */}
      <div className="px-6 sm:px-10 pb-8 relative">
        
        {/* Avatar y Botones de Acción (Solapando el banner con margen negativo) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 md:-mt-20 mb-6 relative z-10">
          
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg overflow-hidden flex items-center justify-center bg-primary-100 text-primary-700 text-6xl font-black flex-shrink-0">
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              profile?.inicial
            )}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
            {isOwnProfile ? (
              <>
                <Button variant="outline" className="flex-1 md:flex-none !px-6 !py-2.5 !text-sm whitespace-nowrap">
                  ⚙️ Editar Perfil
                </Button>
                <Button onClick={cerrarSesion} className="flex-1 md:flex-none !px-6 !py-2.5 !text-sm !bg-red-50 !text-red-600 border border-red-200 hover:!bg-red-100 shadow-none whitespace-nowrap">
                  🚪 Salir
                </Button>
              </>
            ) : (
              <Button className="flex-1 md:flex-none !px-10 !py-2.5 !text-sm shadow-md hover:shadow-lg">
                + Seguir
              </Button>
            )}
          </div>
        </div>

        {/* 3. Nombre y Bio */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            {profile?.name} {profile?.lastname}
          </h1>
          <p className="text-lg font-bold text-primary-600 mt-1">@{profile?.username}</p>
          <p className="text-gray-500 mt-2 text-sm font-medium">Miembro desde {profile?.fechaRegistro}</p>
        </div>

        {/* 4. Cinta de Estadísticas (Horizontal Ribbon) */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 md:gap-14 py-6 border-t border-gray-100">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-3xl font-black text-gray-900">{stats?.total_models || 0}</span>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Diseños</span>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <span className="text-3xl font-black text-gray-900">{stats?.total_followers || 0}</span>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Seguidores</span>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <span className="text-3xl font-black text-gray-900">{stats?.total_downloads || 0}</span>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Descargas Totales</span>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <span className="text-3xl font-black text-gray-900">{stats?.total_likes_received || 0}</span>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Me gusta</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfileHeader;