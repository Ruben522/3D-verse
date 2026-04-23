import React from 'react';
import ReactPaginate from 'react-paginate';

const Pagination = ({ totalPages, currentPage, onPageChange }) => {

    //Hago esta declaración de función aquí y no en un contexto o en el componente padre porque
    //es una función muy específica de este componente y no se reutiliza en ningún otro sitio,
    //por lo que no tiene sentido complicar la estructura del proyecto para algo tan concreto.
    //Además, al estar dentro del componente, tiene acceso directo a las props
    //sin necesidad de pasarlas como argumentos adicionales.
    const handlePageClick = (event) => {
        const newPage = event.selected + 1;
        onPageChange(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <ReactPaginate
            breakLabel="..."
            nextLabel={
                <span className="flex items-center gap-1">
                    Sig <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                </span>
            }
            previousLabel={
                <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg> Ant
                </span>
            }
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            marginPagesDisplayed={1}
            pageCount={totalPages}
            forcePage={currentPage - 1}
            containerClassName="flex items-center justify-center gap-2 mt-12 mb-8 select-none"
            pageLinkClassName="w-10 h-10 flex items-center justify-center rounded-xl font-bold text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all cursor-pointer"
            activeLinkClassName="bg-primary-600 text-white hover:bg-primary-700 hover:text-white shadow-md pointer-events-none"
            breakLinkClassName="w-10 h-10 flex items-center justify-center font-bold text-gray-400"
            previousLinkClassName="px-4 py-2 font-bold text-gray-500 hover:text-primary-600 transition-colors flex items-center cursor-pointer"
            nextLinkClassName="px-4 py-2 font-bold text-gray-500 hover:text-primary-600 transition-colors flex items-center cursor-pointer"
            disabledClassName="opacity-40 cursor-not-allowed pointer-events-none"
        />
    );
};

export default Pagination;