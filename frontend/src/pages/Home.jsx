import React from 'react';
import { Link } from 'react-router-dom';
import useModels from '../hooks/useModels';
import HeroCarousel from '../components/home/HeroCarousel';
import PopularModels from '../components/home/PopularModels';

const Home = () => {
    const { isFetchingModel } = useModels();

    return (
        <div className="min-h-screen transition-colors duration-300">

            {/* 1. SECCIÓN HERO (Mitad Texto / Mitad Carrusel) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-8 md:pt-20 md:pb-16">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

                    {/* Texto Izquierda */}
                    <div className="animate-fade-in pr-0 lg:pr-8 text-center lg:text-left">

                        {/* Etiqueta (Badge): Usamos un morado semitransparente y texto claro en modo oscuro */}
                        <span className="inline-block py-1.5 px-4 rounded-full bg-primary-50 text-primary-700 border border-primary-100 dark:bg-primary-900/30 dark:text-primary-300 dark:border-primary-800 font-black text-sm tracking-widest uppercase mb-6 transition-colors">
                            Impresión 3D Sin Límites
                        </span>

                        {/* Título Principal: Pasa a blanco en oscuro. El gradiente usa tonos más claros (400 a 300) para destacar mejor */}
                        <h1 className="text-5xl lg:text-6xl font-black text-gray-900 dark:text-white tracking-tight leading-[1.1] transition-colors">
                            Encuentra, comparte e imprime <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400 dark:from-primary-400 dark:to-primary-300">diseños increíbles</span>
                        </h1>

                        {/* Párrafo: Un gris más claro para que sea cómodo de leer */}
                        <p className="mt-6 text-lg text-gray-500 dark:text-gray-300 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0 transition-colors">
                            Únete a la comunidad de creadores 3D más activa. Explora miles de modelos listos para imprimir, sube tus propias creaciones y conecta con diseñadores de todo el mundo.
                        </p>

                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            {/* Botón Primario: Mantenemos tu morado, oscureciéndolo un poco al hacer hover en modo oscuro */}
                            <Link to="/models" className="w-full sm:w-auto px-8 py-4 bg-primary-600 text-white font-bold rounded-2xl hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/30 transition-all text-center text-lg">
                                Explorar Modelos
                            </Link>

                            {/* Botón Secundario: Se vuelve oscuro con bordes sutiles en modo oscuro */}
                            <Link to="/comunidad" className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 border border-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-all text-center text-lg shadow-sm hover:shadow">
                                Ver Comunidad
                            </Link>
                        </div>
                    </div>

                    <div className="animate-fade-in w-full">
                        {isFetchingModel ? (
                            <div className="w-full h-[400px] md:h-[500px] bg-gray-100 dark:bg-gray-800 animate-pulse rounded-3xl transition-colors"></div>
                        ) : (
                            <HeroCarousel />
                        )}
                    </div>

                </div>
            </section>

            <div className="bg-white dark:bg-transparent border-t border-gray-100 dark:border-gray-800 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <PopularModels />
                </div>
            </div>

            <section className="py-24 bg-gradient-to-b from-white to-primary-50/30 dark:from-transparent dark:to-primary-900/10 transition-colors duration-300">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <span className="text-6xl mb-6 block">🚀</span>
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight transition-colors">¿Tienes tu propio diseño?</h2>
                    <p className="text-xl text-gray-500 dark:text-gray-400 font-medium mt-4 mb-10 transition-colors">
                        Sube tus archivos STL, crea un portafolio espectacular y empieza a ganar seguidores hoy mismo.
                    </p>
                    <Link to="/subir" className="inline-flex px-10 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black dark:bg-primary-500 dark:hover:bg-primary-400 hover:scale-105 transition-all shadow-xl text-lg">
                        Publicar mi primer diseño
                    </Link>
                </div>
            </section>

        </div>
    );
};

export default Home;