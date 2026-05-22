import React from 'react';
import useCategories from '../../hooks/useCategories';
import TagIcon from '../../assets/icons/TagIcon';
import EditIcon from '../../assets/icons/EditIcon';
import CheckIcon from '../../assets/icons/CheckIcon';
import TrashIcon from '../../assets/icons/TrashIcon';

const ModelsCategories = () => {
    const {
        categories,
        isLoading,
        datosCategoria,
        actualizarDatoCategoria,
        crearCategoria,
        iniciarEdicionCategoria,
        guardarEdicionCategoria,
        removeCategory
    } = useCategories();

    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden transition-colors">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl">
                    <TagIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Gestión de Categorías</h2>
            </div>

            <div className="p-6">
                <form onSubmit={(e) => crearCategoria(e)} className="flex gap-3 mb-8">
                    <input
                        type="text"
                        name="newName"
                        value={datosCategoria.newName}
                        onChange={(e) => actualizarDatoCategoria(e)}
                        placeholder="Nombre de la nueva categoría (ej: Sci-Fi, Vehículos...)"
                        className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all dark:text-white"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !datosCategoria.newName.trim()}
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50 whitespace-nowrap"
                    >
                        {isLoading ? "Añadiendo..." : "Añadir"}
                    </button>
                </form>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.length > 0 ? (
                        categories.map((category) => (
                            <div key={category.id} className="flex items-center justify-between p-3 min-h-[64px] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl hover:border-purple-300 dark:hover:border-purple-700 transition-all group">
                                {datosCategoria.editingId === category.id ? (
                                    <form onSubmit={(e) => guardarEdicionCategoria(e)} className="flex items-center gap-2 w-full">
                                        <input
                                            autoFocus
                                            type="text"
                                            name="editName"
                                            value={datosCategoria.editName}
                                            onChange={(e) => actualizarDatoCategoria(e)}
                                            className="flex-1 bg-gray-50 dark:bg-gray-900 px-3 py-1.5 rounded-lg border border-purple-300 dark:border-purple-600 outline-none text-sm font-bold dark:text-white"
                                        />
                                        <button
                                            type="submit"
                                            className="flex items-center justify-center text-green-500 hover:bg-green-50 dark:hover:bg-green-900/30 p-2 rounded-lg transition-colors"
                                        >
                                            <CheckIcon className="w-5 h-5 shrink-0" />
                                        </button>
                                    </form>
                                ) : (
                                    <>
                                        <span className="font-bold text-gray-700 dark:text-gray-200 truncate px-2">
                                            {category.name}
                                        </span>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => iniciarEdicionCategoria(category)}
                                                className="flex items-center justify-center text-gray-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/30 p-2 rounded-lg transition-all"
                                                title="Editar nombre"
                                            >
                                                <EditIcon className="w-5 h-5 shrink-0" colorClass="currentColor" />
                                            </button>
                                            <button
                                                onClick={() => removeCategory(category.id)}
                                                className="flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 p-2 rounded-lg transition-all"
                                                title="Eliminar categoría"
                                            >
                                                <TrashIcon className="w-5 h-5 shrink-0" />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-10 text-center">
                            <p className="text-gray-400 dark:text-gray-500 italic">No hay categorías creadas todavía.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ModelsCategories;