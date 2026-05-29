import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useModels from '../../hooks/useModels';
import ArrowRightIcon from '../../assets/icons/ArrowRightIcon';
import { useTranslation } from 'react-i18next';

const HeroCarousel = () => {
    const { getRandomModels } = useModels();
    const { t } = useTranslation();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [carouselItems, setCarouselItems] = useState([]);

    useEffect(() => {
        setCarouselItems(getRandomModels());
    }, [getRandomModels]);

    useEffect(() => {
        if (carouselItems.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev === carouselItems.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(interval);
    }, [carouselItems.length]);

    const prevSlide = () => {
        setCurrentIndex(curr => curr === 0 ? carouselItems.length - 1 : curr - 1);
    };

    const nextSlide = () => {
        setCurrentIndex(curr => curr === carouselItems.length - 1 ? 0 : curr + 1);
    };

    return (
        <>
            {carouselItems.length === 0 ? (
                <div className="w-full h-[400px] bg-gray-100 dark:bg-gray-800 rounded-3xl flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 transition-colors duration-300">
                    <p className="text-gray-400 dark:text-gray-500 font-bold">{t('hero_carousel.loading')}</p>
                </div>
            ) : (
                <div className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden group shadow-2xl dark:shadow-black/50 transition-all duration-300">
                    <div
                        className="flex w-full h-full transition-transform duration-700 ease-out"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                        {carouselItems.map((item) => (
                            <div key={item.id} className="w-full h-full flex-shrink-0 relative">
                                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                                    <span className="bg-primary-500 text-white text-xs font-black uppercase tracking-wider py-1 px-3 rounded-lg w-max mb-3">
                                        {t('hero_carousel.featured')}
                                    </span>
                                    <h3 className="text-white text-2xl font-black drop-shadow-lg truncate">{item.title}</h3>
                                    <p className="text-gray-300 text-sm mt-2 line-clamp-2 max-w-md">{item.description}</p>
                                    <Link to={`/models/${item.id}`} className="mt-4 text-white font-bold text-sm hover:text-primary-400 transition-colors w-max">
                                        {t('hero_carousel.view_design')} <ArrowRightIcon className="w-4 h-4 inline-block ml-1" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button onClick={prevSlide} className="absolute top-1/2 -translate-y-1/2 left-4 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-10">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                    <button onClick={nextSlide} className="absolute top-1/2 -translate-y-1/2 right-4 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-10">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
                    </button>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {carouselItems.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`transition-all duration-300 rounded-full ${currentIndex === idx ? 'w-6 h-2 bg-primary-500' : 'w-2 h-2 bg-white/50 hover:bg-white'}`}
                                aria-label={`Ir a diapositiva ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default HeroCarousel;