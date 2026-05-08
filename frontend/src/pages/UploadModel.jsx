import React, { useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
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
import BotBar from '../components/common/BotBar';
import InicialTittle from '../components/common/InicialTittle';
import { useTranslation } from 'react-i18next';

const UploadModel = () => {
    const navigate = useNavigate();
    const { id: editModelId } = useParams();
    const { isAuthenticated } = useUsers();
    const {
        uploadData,
        uploadErrors,
        isUploading,
        expandedSections,
        toggleSection,
        actualizarDatoSubida,
        subirModelo,
        editarModelo,
        prepararEdicion,
        limpiarFormularioSubida
    } = useModels();
    const { t } = useTranslation();

    const isEditMode = !!editModelId;

    useEffect(() => {
        if (isEditMode) {
            prepararEdicion(editModelId);
        } else {
            limpiarFormularioSubida();
        }

        return () => limpiarFormularioSubida();
    }, [editModelId]);

    const handleSave = () => {
        if (isEditMode) {
            editarModelo(editModelId);
        } else {
            subirModelo();
        }
    }

    return isAuthenticated ? (
        <div className="min-h-screen py-12 px-4 sm:px-6 pb-48 md:pb-56 transition-colors duration-300">
            <div className="max-w-4xl mx-auto flex flex-col gap-8">
                <div className="-mb-4 md:-mb-8">
                    <InicialTittle
                        tittle={t('messages.post_model')}
                        subtittle={t('messages.post_model_desc')}
                    />
                </div>

                {uploadErrors?.global && (
                    <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl font-bold flex items-center gap-3 transition-colors">
                        <span>⚠️</span> {uploadErrors.global}
                    </div>
                )}

                <div className="flex flex-col gap-6">

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

                            <div>
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 block mb-2 transition-colors">
                                    {t('model_files.title')}
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={uploadData.title}
                                    onChange={actualizarDatoSubida}
                                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-500 
                                        ${uploadErrors?.title
                                            ? 'border-red-400 bg-red-50 focus:bg-white dark:border-red-500/50 dark:bg-red-900/30 dark:focus:bg-gray-800'
                                            : 'border-gray-200 bg-gray-50 focus:bg-white dark:border-gray-700 dark:bg-gray-900 dark:focus:bg-gray-800'
                                        }`}
                                    placeholder="Ej: Figura de Dragón Articulado"
                                />
                                {uploadErrors?.title && <p className="text-red-500 dark:text-red-400 text-sm font-bold mt-1">{uploadErrors.title}</p>}
                            </div>

                            <CategoryInput />

                            <div>
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 block mb-2 transition-colors">
                                    {t('model_files.description')}
                                </label>
                                <textarea
                                    name="description"
                                    value={uploadData.description}
                                    onChange={actualizarDatoSubida}
                                    rows="4"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-500 outline-none transition-all resize-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                    placeholder={t('model_files.description_placeholder')}
                                />
                            </div>

                            <TagsInput />
                        </div>
                    </AccordionSection>

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

            <BotBar
                title={isEditMode ? "Guardar Cambios" : t('messages.confirmation_upload')}
                description={isEditMode ? "Tus cambios se aplicarán inmediatamente." : t('messages.confirmation_upload_desc')}
                onCancel={() => navigate(isEditMode ? `/models/${editModelId}` : "/")}
                onSubmit={handleSave}
                isLoading={isUploading}
                submitText={isEditMode ? "Actualizar Modelo" : t('messages.post_model')}
                loadingText={isEditMode ? "Actualizando..." : t('messages.loading')}
            />
        </div>
    ) : (
        <Navigate to="/login" replace />
    );
};

export default UploadModel;