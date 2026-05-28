import React, { useRef, useState } from 'react';
import SearchInput from './SearchInput';
import SortDropdown from './SortDropdown';
import FilterDropdown from './FilterDropdown';
import useClickOutside from '../../hooks/useClickOutside';
import { useTranslation } from 'react-i18next';

const SearchBar = ({
    value,
    onChange,
    onClear,
    placeholder,
    categories = [],
    activeCategory,
    onCategoryChange,
    sortOptions = [],
    activeSort,
    onSortChange
}) => {
    const { t } = useTranslation();
    const [openDropdown, setOpenDropdown] = useState(null);
    const containerRef = useRef(null);

    const hasCategories = categories && categories.length > 0;

    useClickOutside(containerRef, () => setOpenDropdown(null));

    const toggleDropdown = (type) => {
        setOpenDropdown(prev => prev === type ? null : type);
    };

    return (
        <div className="relative w-full max-w-5xl mx-auto z-40" ref={containerRef}>
            <div className="flex flex-col md:flex-row bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm dark:shadow-black/20 dark:hover:shadow-black/30 backdrop-blur-xl transition-all duration-300">

                <SearchInput
                    value={value}
                    onChange={onChange}
                    onClear={onClear}
                    placeholder={placeholder || t('searchbar.placeholder', { defaultValue: "Buscar..." })}
                />

                <div className="flex flex-row items-stretch w-full md:w-auto h-[50px] md:h-auto border-t md:border-t-0 md:border-l border-gray-200 dark:border-zinc-800 transition-colors duration-300">

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
                            defaultLabel={t('searchbar.categories', { defaultValue: "Categorías" })}
                            allLabel={t('searchbar.all', { defaultValue: "Todas" })}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchBar;