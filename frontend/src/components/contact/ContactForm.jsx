import React from 'react';
import useContact from '../../hooks/useContact';

const ContactForm = () => {
    // Extraemos absolutamente todo del contexto
    const { formData, handleChange, handleSubmit, isSending, sendSuccess } = useContact();

    return (
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm h-full">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Envíame un mensaje</h3>
            <p className="text-gray-500 text-sm mb-8">¿Tienes alguna pregunta, propuesta de trabajo o simplemente quieres saludar? ¡Escríbeme!</p>

            {sendSuccess ? (
                <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-2xl text-center animate-fade-in flex flex-col items-center justify-center h-[300px]">
                    <svg className="w-16 h-16 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <h4 className="font-bold text-lg">¡Mensaje enviado!</h4>
                    <p className="text-sm mt-1">Gracias por contactar. Te responderé lo antes posible.</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Tu Nombre</label>
                            <input
                                type="text" name="name" required value={formData.name} onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                                placeholder="Ej. John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Tu Email</label>
                            <input
                                type="email" name="email" required value={formData.email} onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                                placeholder="ejemplo@correo.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Asunto</label>
                        <input
                            type="text" name="subject" required value={formData.subject} onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                            placeholder="¿De qué quieres hablar?"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Mensaje</label>
                        <textarea
                            name="message" required rows="5" value={formData.message} onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none resize-none"
                            placeholder="Escribe tu mensaje aquí..."
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={isSending}
                        className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-md flex items-center justify-center gap-2 ${isSending ? 'bg-primary-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700 hover:shadow-lg hover:-translate-y-0.5'
                            }`}
                    >
                        {isSending ? (
                            <span className="animate-pulse">Enviando mensaje...</span>
                        ) : (
                            <>
                                Enviar Mensaje
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                            </>
                        )}
                    </button>
                </form>
            )}
        </div>
    );
};

export default ContactForm;