import React from 'react';
import useUsers from '../../../hooks/useUsers';
import TrashIcon from '../../../assets/icons/TrashIcon';

const AccountSection = () => {
    const { currentUser, eliminarUsuario } = useUsers();

    return (
        <div className="space-y-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Aquí podrás gestionar la seguridad de tu cuenta. (Próximamente: Cambio de contraseña y correo).
            </p>

            <div className="pt-4 border-t border-red-100 dark:border-red-900/30">
                <h4 className="text-red-600 dark:text-red-400 font-bold mb-2">Zona de Peligro</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Eliminar tu cuenta es una acción permanente e irreversible. Se borrarán todos tus modelos, likes, comentarios y configuraciones.
                </p>

                <button
                    onClick={(e) => { e.preventDefault(), eliminarUsuario(currentUser.id) }}
                    className="flex items-center gap-2 px-6 py-3 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-bold rounded-xl transition-all border border-red-200 dark:border-red-800"
                >
                    <TrashIcon className="w-5 h-5 shrink-0" />
                    <span>Eliminar mi cuenta</span>
                </button>
            </div>
        </div>
    );
};

export default AccountSection;