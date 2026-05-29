import React from 'react';
import useUsers from '../../../hooks/useUsers';
import TrashIcon from '../../../assets/icons/TrashIcon';
import { useTranslation } from 'react-i18next';

const DeleteAccount = () => {
    const { currentUser, eliminarUsuario } = useUsers();
    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            <div className="pt-4 border-t border-red-100 dark:border-red-900/30">
                <h4 className="text-red-600 dark:text-red-400 font-bold mb-2">{t('user_settings.account.danger_zone')}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {t('user_settings.account.danger_desc')}
                </p>

                <button
                    onClick={(e) => { e.preventDefault(), eliminarUsuario(currentUser.id) }}
                    className="flex items-center gap-2 px-6 py-3 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-bold rounded-xl transition-all border border-red-200 dark:border-red-800"
                >
                    <TrashIcon className="w-5 h-5 shrink-0" />
                    <span>{t('user_settings.account.delete_account')}</span>
                </button>
            </div>
        </div>
    );
};

export default DeleteAccount;