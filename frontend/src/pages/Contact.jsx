import React, { useEffect } from 'react';
import CreatorInfo from '../components/contact/CreatorInfo';
import ContactForm from '../components/contact/ContactForm';

const Contact = () => {
    // Para que al entrar a la página siempre aparezca arriba del todo
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-surface py-12 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">

                {/* Cabecera de la página */}
                <div className="text-center mb-16 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                        Contacto & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">Sobre Mí</span>
                    </h1>
                    <p className="text-lg text-gray-500 font-medium mt-4 max-w-2xl mx-auto">
                        Conoce al desarrollador detrás de la plataforma o envíame un mensaje directo. Me encantaría conectar contigo.
                    </p>
                </div>

                {/* Grid Dividido (Izquierda: Info, Derecha: Formulario) */}
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 animate-fade-in">

                    {/* Columna Izquierda (Ocupa 5/12 en escritorio) */}
                    <div className="lg:col-span-5">
                        <CreatorInfo />
                    </div>

                    {/* Columna Derecha (Ocupa 7/12 en escritorio) */}
                    <div className="lg:col-span-7">
                        <ContactForm />
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Contact;