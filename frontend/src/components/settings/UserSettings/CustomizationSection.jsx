import React, { useState } from 'react';
import useUsers from '../../../hooks/useUsers';
import AccordionSection from '../../common/AccordionSection';

const CustomizationSection = () => {
    const { datosPerfil, actualizarDatoPerfil } = useUsers();

    const [expandedSections, setExpandedSections] = useState(['avatar', 'banner']);

    const toggleSection = (id) => {
        setExpandedSections(prev =>
            prev.includes(id) ? prev.filter(sec => sec !== id) : [...prev, id]
        );
    };

    const currentAvatar = datosPerfil.avatar || datosPerfil.avatarUrl || '';
    const currentBanner = datosPerfil.banner_url || datosPerfil.bannerUrl || '';
    const currentPrimaryColor = datosPerfil.primary_color || datosPerfil.primaryColor || '#8b5cf6';

    const hasAvatar = currentAvatar.trim() !== '';
    const hasBanner = currentBanner.trim() !== '';

    const handleClearAvatar = () => {
        actualizarDatoPerfil({ target: { name: 'avatar', value: '' } });
    };

    const handleClearBanner = () => {
        actualizarDatoPerfil({ target: { name: 'banner_url', value: '' } });
    };

    return (
        <div className="flex flex-col gap-6 animate-fadeIn">

            <AccordionSection
                id="avatar"
                title="Foto de Perfil"
                subtitle="Tu avatar principal en la comunidad"
                isOpen={expandedSections.includes('avatar')}
                onToggle={toggleSection}
                icon={<span className="text-xl">📸</span>}
            >
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mt-2">
                    <div className="flex-shrink-0 relative">
                        <div
                            className="w-24 h-24 rounded-full border-4 border-gray-100 dark:border-gray-700 shadow-md overflow-hidden flex items-center justify-center text-white text-4xl font-black transition-all duration-300"
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
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 transition-colors">URL de la imagen (jpg, png, webp)</p>
                        <div className="flex gap-2 w-full">
                            <input
                                type="url"
                                name="avatar"
                                value={currentAvatar}
                                onChange={actualizarDatoPerfil}
                                placeholder="Ej: https://misitio.com/mifoto.jpg"
                                className="flex-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 py-2.5 px-3 text-sm focus:border-primary-500 dark:focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none text-gray-900 dark:text-white placeholder-gray-400 transition-all"
                            />

                            {hasAvatar && (
                                <button
                                    type="button"
                                    onClick={handleClearAvatar}
                                    className="px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/50 hover:shadow-sm text-sm font-bold transition-all whitespace-nowrap"
                                >
                                    Quitar foto
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </AccordionSection>

            <AccordionSection
                id="banner"
                title="Banner y Color"
                subtitle="Personaliza la cabecera de tu tarjeta"
                isOpen={expandedSections.includes('banner')}
                onToggle={toggleSection}
                icon={<span className="text-xl">🎨</span>}
            >
                <div className="flex flex-col gap-6 mt-2">
                    <div className="w-full">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 transition-colors">URL de la imagen de fondo</p>
                        <div className="flex gap-2">
                            <input
                                type="url"
                                name="banner_url"
                                value={currentBanner}
                                onChange={actualizarDatoPerfil}
                                placeholder="Ej: https://misitio.com/banner.jpg"
                                className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 py-2.5 px-3 text-sm focus:border-primary-500 dark:focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none text-gray-900 dark:text-white placeholder-gray-400 transition-all"
                            />

                            {hasBanner && (
                                <button
                                    type="button"
                                    onClick={handleClearBanner}
                                    className="px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/50 hover:shadow-sm text-sm font-bold transition-all whitespace-nowrap"
                                >
                                    Quitar foto
                                </button>
                            )}
                        </div>

                        {hasBanner && (
                            <div className="mt-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm h-32 md:h-48 relative bg-gray-200 dark:bg-gray-800 flex items-center justify-center transition-colors">
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
                            <div className="w-full pt-4 mt-4 border-t border-gray-100 dark:border-gray-700 transition-colors animate-fadeIn">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 transition-colors">Color de Cabecera Alternativo</label>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 transition-colors">Este color se usará si no proporcionas una imagen de banner.</p>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        name="primary_color"
                                        value={currentPrimaryColor}
                                        onChange={actualizarDatoPerfil}
                                        className="h-10 w-14 rounded cursor-pointer border-0 p-0 shadow-sm"
                                    />
                                    <span className="text-sm font-mono text-gray-500 dark:text-gray-400 uppercase transition-colors">{currentPrimaryColor}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </AccordionSection>

        </div>
    );
};

export default CustomizationSection;