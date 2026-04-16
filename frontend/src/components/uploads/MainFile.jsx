import React from 'react';
import useModels from '../../hooks/useModels';

const MainFile = () => {
    const { currentModel } = useModels();

    return (
        <div className="py-6 animate-fade-in">
            {currentModel?.fileUrl ? (
                <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-primary-50/50 rounded-2xl border border-primary-100 gap-4">

                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white border border-primary-100 flex items-center justify-center text-primary-600 shadow-sm">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-primary-900 text-xl">Modelo Original</h3>
                            <p className="text-sm text-primary-600 mt-1">Archivo base para impresión o visualización</p>
                        </div>
                    </div>

                    <a
                        href={currentModel.fileUrl}
                        download
                        className="flex items-center gap-2 text-white bg-primary-600 border border-primary-600 hover:bg-primary-700 font-bold px-6 py-3 rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 whitespace-nowrap"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        Descargar Archivo
                    </a>

                </div>
            ) : (
                <p className="text-center text-gray-500 py-10 font-medium">No hay archivo principal disponible.</p>
            )}
        </div>
    );
};

export default MainFile;