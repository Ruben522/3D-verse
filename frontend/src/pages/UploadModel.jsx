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
        <div className="min-h-screen bg-surface py-12 px-4 sm:px-6 pb-40">
            <div className="max-w-4xl mx-auto flex flex-col gap-8">

                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">{t('messages.post_model')}</h1>
                    <p className="text-gray-500 font-medium mt-2 text-lg">{t('messages.post_model_desc')}</p>
                </div>

                {uploadErrors?.global && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl font-bold flex items-center gap-3">
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
                                <label className="text-sm font-bold text-gray-700 block mb-2">{t('model_files.title')}</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={uploadData.title}
                                    onChange={actualizarDatoSubida}
                                    className={`w-full px-4 py-3 rounded-xl border ${uploadErrors?.title ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none transition-all`}
                                    placeholder="Ej: Figura de Dragón Articulado"
                                />
                                {uploadErrors?.title && <p className="text-red-500 text-sm font-bold mt-1">{uploadErrors.title}</p>}
                            </div>

                            <CategoryInput />

                            <div>
                                <label className="text-sm font-bold text-gray-700 block mb-2">{t('model_files.description')}</label>
                                <textarea
                                    name="description"
                                    value={uploadData.description}
                                    onChange={actualizarDatoSubida}
                                    rows="4"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none"
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
                            <GalleryFiles />
                            <hr className="border-gray-100" />
                            <PartsFiles />
                        </div>
                    </AccordionSection>

                </div>
            </div>

            <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-gray-200 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="hidden sm:block">
                        <p className="font-bold text-gray-900">{t('messages.confirmation_upload')}</p>
                        <p className="text-sm text-gray-500">{t('messages.confirmation_upload_desc')}</p>
                    </div>
                    <Button
                        onClick={subirModelo}
                        disabled={isUploading}
                        className="w-full sm:w-auto !px-12 py-4 !text-lg !bg-primary-600 hover:!bg-primary-700 shadow-primary-500/30"
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