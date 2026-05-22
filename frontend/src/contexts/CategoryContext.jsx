import React, { createContext, useState, useCallback, useEffect } from 'react';
import useAPI from '../hooks/useAPI';
import useMessage from '../hooks/useMessage';

const category = createContext();

export const CategoryProvider = ({ children }) => {
    const api = useAPI();
    const { showMessage, showConfirm } = useMessage();
    const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/categories`;

    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const datosCategoriaInicial = { newName: "", editName: "", editingId: null };
    const [datosCategoria, setDatosCategoria] = useState(datosCategoriaInicial);

    const actualizarDatoCategoria = (evento) => {
        const { name, value } = evento.target;
        setDatosCategoria((prev) => ({ ...prev, [name]: value }));
    };

    const getCategories = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get(apiUrl);
            const data = response.data?.data || response.data;
            setCategories(data);
        } catch (error) {
            console.error("Error al cargar categorías:", error);
        } finally {
            setIsLoading(false);
        }
    }, [api, apiUrl]);

    useEffect(() => {
        getCategories();
    }, []);

    const crearCategoria = async (evento) => {
        if (evento) evento.preventDefault();
        const nameToSave = datosCategoria.newName.trim();

        if (!nameToSave) return;
        setIsLoading(true);

        try {
            const response = await api.post(apiUrl, { name: nameToSave });
            const newCategory = response.data?.data || response.data;

            setCategories(prev => [...prev, newCategory].sort((a, b) => a.name.localeCompare(b.name)));
            showMessage("Categoría creada con éxito", "success");

            setDatosCategoria(prev => ({ ...prev, newName: "" }));
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Error al crear la categoría";
            showMessage(errorMsg, "error");
        } finally {
            setIsLoading(false);
        }
    };

    const iniciarEdicionCategoria = (cat) => {
        setDatosCategoria(prev => ({ ...prev, editingId: cat.id, editName: cat.name }));
    };

    const guardarEdicionCategoria = async (evento) => {
        if (evento) evento.preventDefault();
        const { editingId, editName } = datosCategoria;

        if (!editName.trim() || !editingId) return;
        setIsLoading(true);

        try {
            const response = await api.put(`${apiUrl}/${editingId}`, { name: editName.trim() });
            const updatedCategory = response.data?.data || response.data;

            setCategories(prev =>
                prev.map(cat => cat.id === editingId ? updatedCategory : cat)
                    .sort((a, b) => a.name.localeCompare(b.name))
            );
            showMessage("Categoría actualizada", "success");

            setDatosCategoria(prev => ({ ...prev, editingId: null, editName: "" }));
        } catch (error) {
            showMessage("No se pudo actualizar la categoría", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const removeCategory = async (id) => {
        showConfirm(
            "¿Estás seguro? Se eliminará esta categoría de todos los modelos asociados.",
            async () => {
                setIsLoading(true);
                try {
                    await api.remove(`${apiUrl}/${id}`);
                    setCategories(prev => prev.filter(cat => cat.id !== id));
                    showMessage("Categoría eliminada correctamente", "success");
                } catch (error) {
                    console.error("Error al borrar:", error);
                    showMessage("Error al eliminar la categoría.", "error");
                } finally {
                    setIsLoading(false);
                }
            }
        );
    };

    const exportData = {
        categories,
        tags,
        isLoading,
        datosCategoria,
        actualizarDatoCategoria,
        getCategories,
        crearCategoria,
        iniciarEdicionCategoria,
        guardarEdicionCategoria,
        removeCategory,
    };

    return (
        <category.Provider value={exportData}>
            {children}
        </category.Provider>
    );
};

export { category };
export default CategoryProvider;