import React, { useRef } from 'react';
import { useSearchBox } from 'react-instantsearch';

const SearchBar = (props) => {
    // Extraemos la lógica del buscador de Meilisearch
    const { query, refine, clear } = useSearchBox(props);
    const inputRef = useRef(null);

    // Función para limpiar el input y devolverle el foco
    const handleClear = () => {
        clear();
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    return (
        <div className="relative w-full max-w-3xl mx-auto">
            {/* Icono de la Lupa (Izquierda) */}
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>

            {/* Input de Búsqueda */}
            <input
                ref={inputRef}
                type="text"
                value={query} // El texto actual
                onChange={(event) => refine(event.target.value)} // Envia el texto a Meilisearch al instante
                placeholder="Buscar personajes, vehículos, medicina, autores..."
                className="w-full pl-12 pr-12 py-4 bg-white border-2 border-gray-100 rounded-2xl shadow-sm text-gray-800 font-medium placeholder-gray-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all"
                autoComplete="off"
                spellCheck="false"
            />

            {/* Botón de Borrar 'X' (Derecha) - Solo aparece si hay texto */}
            {query && (
                <button
                    onClick={handleClear}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-700 transition-colors"
                    title="Borrar búsqueda"
                >
                    <svg className="w-5 h-5 bg-gray-100 hover:bg-gray-200 rounded-full p-0.5 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default SearchBar;