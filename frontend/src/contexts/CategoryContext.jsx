import React, { createContext, useState, useEffect } from 'react';
import useAPI from '../hooks/useAPI';
import useMessage from '../hooks/useMessage';
import { useTranslation } from 'react-i18next';

const category = createContext();

const CategoryContext = ({ children }) => {
    const api = useAPI();
    const { showMessage, showConfirm } = useMessage();
    const { t } = useTranslation();
    const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/categories`;
    const initialCategoryData = { newName: "", editName: "", editingId: null };

    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [categoryData, setCategoryData] = useState(initialCategoryData);

    const updateCategoryData = (evento) => {
        const { name, value } = evento.target;
        setCategoryData((prev) => ({ ...prev, [name]: value }));
    };

    const getCategories = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(apiUrl);
            const data = response.data?.data || response.data;
            setCategories(data);
        } catch (error) {
            showMessage(t("category_context.fetch_error"), "error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getCategories();
    }, []);

    const createCategory = async (evento) => {
        if (evento) evento.preventDefault();
        const nameToSave = categoryData.newName.trim();

        if (!nameToSave) return;
        setIsLoading(true);

        try {
            const response = await api.post(apiUrl, { name: nameToSave });
            const newCategory = response.data?.data || response.data;

            setCategories(prev => [...prev, newCategory].sort((a, b) => a.name.localeCompare(b.name)));
            showMessage(t("category_context.create_success"), "success");

            setCategoryData(prev => ({ ...prev, newName: "" }));
        } catch (error) {
            showMessage(t("category_context.create_error"), "error");
        } finally {
            setIsLoading(false);
        }
    };

    const startEditingCategory = (cat) => {
        setCategoryData(prev => ({ ...prev, editingId: cat.id, editName: cat.name }));
    };

    const saveCategoryEdit = async (evento) => {
        if (evento) evento.preventDefault();
        const { editingId, editName } = categoryData;

        if (!editName.trim() || !editingId) return;
        setIsLoading(true);

        try {
            const response = await api.put(`${apiUrl}/${editingId}`, { name: editName.trim() });
            const updatedCategory = response.data?.data || response.data;

            setCategories(prev =>
                prev.map(cat => cat.id === editingId ? updatedCategory : cat)
                    .sort((a, b) => a.name.localeCompare(b.name))
            );
            showMessage(t("category_context.update_success"), "success");

            setCategoryData(prev => ({ ...prev, editingId: null, editName: "" }));
        } catch (error) {
            showMessage(t("category_context.update_error"), "error");
        } finally {
            setIsLoading(false);
        }
    };

    const removeCategory = async (id) => {
        showConfirm(
            t("category_context.delete_confirmation"),
            async () => {
                setIsLoading(true);
                try {
                    await api.remove(`${apiUrl}/${id}`);
                    setCategories(prev => prev.filter(cat => cat.id !== id));
                    showMessage(t("category_context.delete_success"), "success");
                } catch (error) {
                    showMessage(t("category_context.delete_error"), "error");
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
        categoryData,
        updateCategoryData,
        getCategories,
        createCategory,
        startEditingCategory,
        saveCategoryEdit,
        removeCategory,

        datosCategoria: categoryData,
        actualizarDatoCategoria: updateCategoryData,
        crearCategoria: createCategory,
        iniciarEdicionCategoria: startEditingCategory,
        guardarEdicionCategoria: saveCategoryEdit
    };

    return (
        <category.Provider value={exportData}>
            {children}
        </category.Provider>
    );
};

export { category };
export default CategoryContext;