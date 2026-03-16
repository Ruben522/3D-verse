import React from "react";
import ModelCard from "../components/models/ModelCard";
import useModels from "../hooks/useModels";
import useUsers from "../hooks/useUsers";

const Home = () => {
    const { models } = useModels();
    const { currentUser } = useUsers();

    return (
        <div className="min-h-screen bg-surface">
            <>
            {console.log(currentUser)}
            </>
            <section className="relative overflow-hidden bg-white pt-16 pb-24 lg:pt-32 lg:pb-40 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-wider text-primary-600 uppercase bg-primary-50 rounded-full">
                            Comunidad 3D de Nueva Generación
                        </span>
                        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8">
                            Tus ideas merecen{" "}
                            <span className="text-primary-600">dimensión.</span>
                        </h1>
                        <p className="text-xl text-gray-500 mb-10 leading-relaxed">
                            Descubre miles de modelos listos para imprimir y personalízalos
                            directamente en tu navegador con nuestro visor avanzado.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button className="w-full sm:w-auto bg-primary-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary-200 hover:bg-primary-700 hover:-translate-y-1 transition-all">
                                🚀 Explorar Galería
                            </button>
                            <button className="w-full sm:w-auto bg-white text-gray-700 border-2 border-gray-100 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all">
                                📤 Subir Modelo
                            </button>
                        </div>
                    </div>
                </div>

                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] bg-primary-50 rounded-full blur-3xl opacity-50" />
            </section>
        </div>
    );
};

export default Home;