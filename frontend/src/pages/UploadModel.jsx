import React from 'react';
import { Navigate } from 'react-router-dom';
import useUsers from '../hooks/useUsers';
import useModels from '../hooks/useModels';
import Button from '../components/common/Button';
import AccordionSection from '../components/common/AccordionSection';
import MainFile from '../components/uploads/MainFile';
import ImagesFiles from '../components/uploads/ImagesFiles';
import GalleryFiles from '../components/uploads/GalleryFiles';
import PartsFiles from '../components/uploads/PartsFiles';
import TagsInput from '../components/uploads/TagsInput';
import CategoryInput from '../components/uploads/CategoryInput';
import { useTranslation } from 'react-i18next';

const UploadModel = () => {
    const { isAuthenticated } = useUsers();
    const {
        uploadData,
        uploadErrors,
        isUploading,
        expandedSections,
        toggleSection,
        actualizarDatoSubida,
        subirModelo
    } = useModels();
    const { t } = useTranslation();

    return isAuthenticated ? (
        // Quitamos bg-surface y añadimos transiciones
        <div className="min-h-screen py-12 px-4 sm:px-6 pb-40 transition-colors duration-300">
            <div className="max-w-4xl mx-auto flex flex-col gap-8">

                {/* CABECERA */}
                <div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight transition-colors">
                        {t('messages.post_model')}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-2 text-lg transition-colors">
                        {t('messages.post_model_desc')}
                    </p>
                </div>

                {/* MENSAJE DE ERROR GLOBAL */}
                {uploadErrors?.global && (
                    <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl font-bold flex items-center gap-3 transition-colors">
                        <span>⚠️</span> {uploadErrors.global}
                    </div>
                )}

                <div className="flex flex-col gap-6">

                    {/* SECCIÓN 1: DETALLES DEL MODELO */}
                    <AccordionSection
                        id="info"
                        title={t('messages.model_details')}
                        subtitle={t('messages.model_details_desc')}
                        isOpen={expandedSections.includes('info')}
                        hasError={!!uploadErrors?.title}
                        onToggle={toggleSection}
                        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>}
                    >
                        <div className="flex flex-col gap-5 mt-4">

                            {/* CAMPO: TÍTULO */}
                            <div>
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 block mb-2 transition-colors">
                                    {t('model_files.title')}
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={uploadData.title}
                                    onChange={actualizarDatoSubida}
                                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all dark:text-white dark:placeholder-gray-500 
                                        ${uploadErrors?.title
                                            ? 'border-red-400 bg-red-50 dark:border-red-500/50 dark:bg-red-900/30'
                                            : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
                                        } 
                                        focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-500`}
                                    placeholder="Ej: Figura de Dragón Articulado"
                                />
                                {uploadErrors?.title && <p className="text-red-500 dark:text-red-400 text-sm font-bold mt-1">{uploadErrors.title}</p>}
                            </div>

                            {/* COMPONENTES ANIDADOS (Categoría) */}
                            <CategoryInput />

                            {/* CAMPO: DESCRIPCIÓN */}
                            <div>
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 block mb-2 transition-colors">
                                    {t('model_files.description')}
                                </label>
                                <textarea
                                    name="description"
                                    value={uploadData.description}
                                    onChange={actualizarDatoSubida}
                                    rows="4"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-500 outline-none transition-all resize-none dark:text-white dark:placeholder-gray-500"
                                    placeholder={t('model_files.description_placeholder')}
                                />
                            </div>

                            {/* COMPONENTES ANIDADOS (Etiquetas) */}
                            <TagsInput />
                        </div>
                    </AccordionSection>

                    {/* SECCIÓN 2: ARCHIVOS REQUERIDOS */}
                    <AccordionSection
                        id="files"
                        title={t('messages.required_files')}
                        subtitle={t('messages.files_required_desc')}
                        isOpen={expandedSections.includes('files')}
                        hasError={!!uploadErrors?.main_file || !!uploadErrors?.main_image}
                        onToggle={toggleSection}
                        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>}
                    >
                        <div className="grid md:grid-cols-2 gap-6 mt-4">
                            <MainFile />
                            <ImagesFiles />
                        </div>
                    </AccordionSection>

                    {/* SECCIÓN 3: ARCHIVOS OPCIONALES */}
                    <AccordionSection
                        id="extras"
                        title={t('messages.optionals_files')}
                        subtitle={t('messages.optionals_files_desc')}
                        isOpen={expandedSections.includes('extras')}
                        hasError={false}
                        onToggle={toggleSection}
                        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>}
                    >
                        <div className="flex flex-col gap-8 mt-4">
                            <PartsFiles />
                            <GalleryFiles />
                        </div>
                    </AccordionSection>

                </div>
            </div>

            {/* BARRA INFERIOR DE PUBLICACIÓN */}
            <div className="fixed bottom-0 left-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.3)] z-50 transition-colors duration-300">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="hidden sm:block">
                        <p className="font-bold text-gray-900 dark:text-white transition-colors">{t('messages.confirmation_upload')}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">{t('messages.confirmation_upload_desc')}</p>
                    </div>
                    <Button
                        onClick={subirModelo}
                        disabled={isUploading}
                        className="w-full sm:w-auto !px-12 py-4 !text-lg !bg-primary-600 hover:!bg-primary-700 dark:!bg-primary-500 dark:hover:!bg-primary-400 shadow-primary-500/30"
                    >
                        {isUploading ? t('messages.loading') : t('messages.post_model')}
                    </Button>
                </div>
            </div>
        </div>
    ) : (
        <Navigate to="/login" replace />
    );
};

export default UploadModel;