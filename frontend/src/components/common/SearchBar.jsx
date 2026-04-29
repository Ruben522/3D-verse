import React, { useRef, useState } from 'react';
import SearchInput from './SearchInput';
import SortDropdown from './SortDropdown';
import FilterDropdown from './FilterDropdown';
import useClickOutside from '../../hooks/useClickOutside';

const SearchBar = ({
    value,
    onChange,
    onClear,
    placeholder = "Buscar...",
    categories = [],
    activeCategory,
    onCategoryChange,
    sortOptions = [],
    activeSort,
    onSortChange
}) => {
    const [openDropdown, setOpenDropdown] = useState(null);
    const containerRef = useRef(null);
    const hasCategories = categories && categories.length > 0;

    useClickOutside(containerRef, () => setOpenDropdown(null));

    const toggleDropdown = (type) => {
        setOpenDropdown(prev => prev === type ? null : type);
    };

    return (
        <div className="relative w-full max-w-5xl mx-auto z-40" ref={containerRef}>
            <div className="flex flex-col md:flex-row bg-white border border-gray-200 rounded-lg shadow-sm relative">

                <SearchInput
                    value={value}
                    onChange={onChange}
                    onClear={onClear}
                    placeholder={placeholder}
                />

                <div className="flex flex-row items-stretch w-full md:w-auto h-[50px] md:h-auto border-t md:border-t-0 md:border-l border-gray-200">

                    <SortDropdown
                        options={sortOptions}
                        activeSort={activeSort}
                        onSortChange={onSortChange}
                        isOpen={openDropdown === 'sort'}
                        onToggle={() => toggleDropdown('sort')}
                        isAlone={!hasCategories}
                    />

                    {hasCategories && (
                        <FilterDropdown
                            options={categories}
                            activeFilter={activeCategory}
                            onFilterChange={onCategoryChange}
                            isOpen={openDropdown === 'category'}
                            onToggle={() => toggleDropdown('category')}
                            defaultLabel="Categorías"
                            allLabel="Todas"
                        />
                    )}
                </div>

            </div>
        </div>
    );
};

export default SearchBar;