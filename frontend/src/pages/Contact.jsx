import React, { useEffect } from 'react';
import CreatorInfo from '../components/contact/CreatorInfo';
import ContactForm from '../components/contact/ContactForm';
import { useTranslation } from 'react-i18next';

const Contact = () => {
    const { t } = useTranslation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">

                <div className="text-center mb-16 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight transition-colors">
                        {t('contact.contact_title1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400 dark:from-primary-500 dark:to-primary-300">{t('contact.contact_title2')}</span>
                    </h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400 font-medium mt-4 max-w-2xl mx-auto transition-colors">
                        {t('contact.contact_desc')}
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 animate-fade-in">

                    <div className="lg:col-span-5">
                        <CreatorInfo />
                    </div>

                    <div className="lg:col-span-7">
                        <ContactForm />
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Contact;