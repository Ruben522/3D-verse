import React from 'react';
import ReactPaginate from 'react-paginate';
import { useTranslation } from 'react-i18next';

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
    const { t } = useTranslation();

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
                    {t('buttons.next')} <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                </span>
            }
            previousLabel={
                <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                    {t('buttons.previous')}
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