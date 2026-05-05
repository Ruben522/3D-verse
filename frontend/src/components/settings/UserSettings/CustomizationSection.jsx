import React from 'react';
import useUsers from '../../../hooks/useUsers';

const CustomizationSection = () => {
    const { datosPerfil, actualizarDatoPerfil, currentUser } = useUsers();

    const currentAvatar = datosPerfil.avatar || datosPerfil.avatarUrl || '';
    const currentBanner = datosPerfil.banner_url || datosPerfil.bannerUrl || '';
    const currentPrimaryColor = datosPerfil.primary_color || datosPerfil.primaryColor || '#8b5cf6';

    const hasAvatar = currentAvatar.trim() !== '';
    const hasBanner = currentBanner.trim() !== '';

    // Funciones limpiadoras
    const handleClearAvatar = () => {
        actualizarDatoPerfil({ target: { name: 'avatar', value: '' } });
    };

    const handleClearBanner = () => {
        actualizarDatoPerfil({ target: { name: 'banner_url', value: '' } });
    };

    return (
        <div className="space-y-8 animate-fadeIn pt-4 border-t border-gray-100">
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Diseño de tu Perfil</h2>
                <p className="text-sm text-gray-500 mb-6">Personaliza tu foto y la cabecera para destacar en la comunidad.</p>

                <div className="flex flex-col gap-8 p-6 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="w-full">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Foto de Perfil (URL)</label>
                        <p className="text-xs text-gray-500 mb-3">Tu avatar principal. Asegúrate de que la URL termine en .jpg o .png.</p>

                        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">

                            <div className="flex-shrink-0 relative">
                                <div
                                    className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden flex items-center justify-center text-white text-4xl font-black transition-all duration-300"
                                    style={{ backgroundColor: hasAvatar ? 'transparent' : '#8b5cf6' }}
                                >
                                    {hasAvatar ? (
                                        <img
                                            src={currentAvatar}
                                            alt="Vista previa avatar"
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                        />
                                    ) : (
                                        <span>{datosPerfil.username ? datosPerfil.username.charAt(0).toUpperCase() : 'U'}</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 w-full">
                                <div className="flex gap-2 w-full">
                                    <input
                                        type="url"
                                        name="avatar"
                                        value={currentAvatar}
                                        onChange={actualizarDatoPerfil}
                                        placeholder="Ej: https://misitio.com/mifoto.jpg"
                                        className="flex-1 w-full rounded-lg border-gray-300 bg-white py-2.5 px-3 text-sm focus:border-primary-500 focus:ring-primary-500 outline-none border transition-all"
                                    />

                                    {hasAvatar && (
                                        <button
                                            type="button"
                                            onClick={handleClearAvatar}
                                            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg border border-red-200 hover:bg-red-100 hover:shadow-sm text-sm font-bold transition-all whitespace-nowrap"
                                        >
                                            Quitar foto
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-200" />
                    <div className="w-full">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Banner del Perfil (URL)</label>
                        <p className="text-xs text-gray-500 mb-2">Imagen horizontal que se mostrará en la parte superior de tu tarjeta.</p>

                        <div className="flex gap-2">
                            <input
                                type="url"
                                name="banner_url"
                                value={currentBanner}
                                onChange={actualizarDatoPerfil}
                                placeholder="Ej: https://misitio.com/banner.jpg"
                                className="flex-1 rounded-lg border-gray-300 bg-white py-2.5 px-3 text-sm focus:border-primary-500 focus:ring-primary-500 outline-none border transition-all"
                            />

                            {hasBanner && (
                                <button
                                    type="button"
                                    onClick={handleClearBanner}
                                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg border border-red-200 hover:bg-red-100 hover:shadow-sm text-sm font-bold transition-all whitespace-nowrap"
                                >
                                    Quitar foto
                                </button>
                            )}
                        </div>

                        {hasBanner && (
                            <div className="mt-4 rounded-lg overflow-hidden border border-gray-200 shadow-sm h-32 md:h-48 relative bg-gray-200 flex items-center justify-center">
                                <div
                                    className="w-full h-full transition-all duration-300"
                                    style={{
                                        backgroundImage: `url(${currentBanner})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}
                                />
                                <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm font-medium">
                                    Vista previa
                                </div>
                            </div>
                        )}

                        {!hasBanner && (
                            <div className="w-full pt-5 mt-2 animate-fadeIn">
                                <label className="block text-sm font-bold text-gray-700 mb-1">Color de Cabecera</label>
                                <p className="text-xs text-gray-500 mb-3">Como no tienes una foto de banner, usaremos este color.</p>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        name="primary_color"
                                        value={currentPrimaryColor}
                                        onChange={actualizarDatoPerfil}
                                        className="h-10 w-14 rounded cursor-pointer border-0 p-0 shadow-sm"
                                    />
                                    <span className="text-sm font-mono text-gray-500 uppercase">{currentPrimaryColor}</span>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CustomizationSection;