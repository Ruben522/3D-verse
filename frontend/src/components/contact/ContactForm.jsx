import React from 'react';
import useContact from '../../hooks/useContact';
import { useTranslation } from 'react-i18next';

const ContactForm = () => {
    const { formData, handleChange, handleSubmit, isSending, sendSuccess } = useContact();
    const { t } = useTranslation();

    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm h-full transition-colors duration-300">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-2 transition-colors">{t('contact.send_email')}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 transition-colors">{t('contact.questions')}</p>

            {sendSuccess ? (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-400 p-6 rounded-2xl text-center animate-fade-in flex flex-col items-center justify-center h-[300px] transition-colors">
                    <svg className="w-16 h-16 text-green-500 dark:text-green-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <h4 className="font-bold text-lg">{t('contact.email_send')}</h4>
                    <p className="text-sm mt-1 text-green-600 dark:text-green-500">{t('contact.thanks')}</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2 transition-colors">{t('contact.name_label')}</label>
                            <input
                                type="text" name="name" required value={formData.name} onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-500 focus:border-transparent transition-all outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                placeholder={t('contact.name_placeholder')}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2 transition-colors">{t('contact.email_label')}</label>
                            <input
                                type="email" name="email" required value={formData.email} onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-500 focus:border-transparent transition-all outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                placeholder={t('contact.email_placeholder')}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2 transition-colors">{t('contact.subject_label')}</label>
                        <input
                            type="text" name="subject" required value={formData.subject} onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-500 focus:border-transparent transition-all outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                            placeholder={t('contact.subject_placeholder')}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2 transition-colors">{t('contact.message_label')}</label>
                        <textarea
                            name="message" required rows="5" value={formData.message} onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-500 focus:border-transparent transition-all outline-none resize-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                            placeholder={t('contact.message_placeholder')}
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={isSending}
                        className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-md flex items-center justify-center gap-2 
                            ${isSending
                                ? 'bg-primary-400 dark:bg-primary-500/50 cursor-not-allowed'
                                : 'bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-400 hover:shadow-lg hover:-translate-y-0.5'
                            }`}
                    >
                        {isSending ? (
                            <span className="animate-pulse">{t('contact.sending')}</span>
                        ) : (
                            <>
                                {t('contact.send')}
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