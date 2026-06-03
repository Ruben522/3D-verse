import React, { useState, useEffect, createContext, useCallback } from "react";
import useUsers from "../hooks/useUsers.js";
import useAPI from "../hooks/useAPI.js";
import { useNavigate } from "react-router-dom";
import { validateUploadData, validateFileSize } from "../utils/uploadValidations";
import useMessage from "../hooks/useMessage.js";
import { normalizeMeiliHit, normalizeModelData } from "../utils/normalizers";
import { modelsIndex } from "../services/meiliClient.js";
import useCategories from '../hooks/useCategories.js';
import { useTranslation } from "react-i18next";

const modelContext = createContext();

const ModelsMeiliContext = ({ children }) => {
    const navigate = useNavigate();
    const api = useAPI();
    const { currentUser, isAdmin } = useUsers();
    const { showMessage, showConfirm } = useMessage();
    const { categories } = useCategories();
    const { t } = useTranslation();

    const backendUrl = import.meta.env.VITE_API_URL;
    const apiUrl = `${backendUrl}/models`;

    const initialUploadData = { title: "", description: "", categories: [], tags: [] };
    const initialUploadFiles = { main_file: null, main_image: null, gallery: [], parts: [] };
    const initialPagination = { page: 1, total: 0, totalPages: 1 };

    const sortOptions = [
        { value: "created_at:desc", label: t("models_context.sort_options.newest") },
        { value: "likes_count:desc", label: t("models_context.sort_options.popular") },
        { value: "downloads:desc", label: t("models_context.sort_options.downloads") },
    ];

    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [modelsData, setModelsData] = useState([]);
    const [pagination, setPagination] = useState(initialPagination);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("");
    const [activeTag, setActiveTag] = useState("");
    const [sortBy, setSortBy] = useState("created_at:desc");
    const [isSearching, setIsSearching] = useState(false);

    const [currentModel, setCurrentModel] = useState(null);
    const [detailUI, setDetailUI] = useState({
        activeMediaTab: "imagenes",
        activeInfoTab: "detalles",
        activeUploadTab: "todo",
        mainImage: null,
        active3DUrl: null,
        isInteractive: false,
        detectedParts: [],
        selectedPart: null,
        currentColor: "#ffffff",
    });

    const [uploadData, setUploadData] = useState(initialUploadData);
    const [uploadFiles, setUploadFiles] = useState(initialUploadFiles);
    const [uploadErrors, setUploadErrors] = useState({});
    const [isUploading, setIsUploading] = useState(false);
    const [expandedSections, setExpandedSections] = useState(['info', 'files']);
    const [existingFiles, setExistingFiles] = useState(null);

    const searchModels = async (query = "", page = 1) => {
        setIsSearching(true);
        try {
            let searchParams = {
                hitsPerPage: 12,
                page: page,
                sort: [sortBy],
                filter: []
            };

            if (activeCategory) {
                searchParams = {
                    ...searchParams,
                    filter: [...searchParams.filter, `category_names = '${activeCategory}'`]
                };
            }
            if (activeTag) {
                searchParams = {
                    ...searchParams,
                    filter: [...searchParams.filter, `tag_names = '${activeTag}'`]
                };
            }

            const results = await modelsIndex.search(query, searchParams);

            setModelsData(results.hits.map(normalizeMeiliHit));
            setPagination({
                page: results.page,
                total: results.totalHits,
                totalPages: results.totalPages
            });
        } catch (err) {
            console.error("Error en Meilisearch:", err);
            showMessage(t("models_context.meili_search_error"), "error");
        } finally {
            setIsSearching(false);
            setIsInitialLoad(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            searchModels(searchTerm, 1);
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, activeCategory, activeTag, sortBy]);

    const fetchModels = (page = 1) => searchModels(searchTerm, page);

    const getTopPopularModels = () => {
        if (!modelsData || modelsData.length === 0) return [];
        return [...modelsData].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 5);
    };

    const getRandomModels = () => {
        if (!modelsData || modelsData.length === 0) return [];
        const modelsWithImages = modelsData.filter(m => m.imageUrl);
        return [...modelsWithImages].sort(() => 0.5 - Math.random()).slice(0, 10);
    };

    const fetchModelById = useCallback(async (id) => {
        try {
            setCurrentModel(null);
            const data = await api.get(`${apiUrl}/${id}`);
            const normalizedData = normalizeModelData(data.data);
            setCurrentModel(normalizedData);

            setDetailUI({
                activeMediaTab: "imagenes",
                activeInfoTab: "detalles",
                mainImage: normalizedData.imageUrl,
                active3DUrl: normalizedData.fileUrl,
                isInteractive: false,
                detectedParts: [],
                selectedPart: null,
                currentColor: normalizedData.mainColor || "#ffffff",
            });
        } catch (err) {
            showMessage(t("models_context.model_error"), "error");
        }
    }, [apiUrl, api, showMessage]);

    const updateDetailUI = useCallback((field, value) => {
        setDetailUI((prev) => {
            const newState = { ...prev, [field]: value };
            if (field === 'activeMediaTab' || field === 'active3DUrl') {
                newState.isInteractive = false;
            }
            return newState;
        });
    }, []);

    const downloadPackage = useCallback(async (modelId, packageType) => {
        try {
            const url = `${backendUrl}/downloads/${modelId}?type=${packageType}`;
            const fileName = `${currentModel.title}.zip`;
            await api.downloadPost(url, fileName);
        } catch (err) {
            showMessage(t("models_context.download_package_error"), "error");
        }
    }, [backendUrl, currentModel, api, showMessage]);

    const toggleSection = useCallback((sectionId) => {
        setExpandedSections(prev => prev.includes(sectionId) ? prev.filter(id => id !== sectionId) : [...prev, sectionId]);
    }, []);

    const updateUploadData = useCallback((evento) => {
        const { name, value } = evento.target;
        setUploadData((prev) => ({ ...prev, [name]: value }));
        if (uploadErrors[name]) setUploadErrors(prev => ({ ...prev, [name]: null }));
    }, [uploadErrors]);

    const toggleCategory = useCallback((categoryId) => {
        setUploadData(prev => ({
            ...prev,
            categories: prev.categories.includes(categoryId)
                ? prev.categories.filter(id => id !== categoryId)
                : [...prev.categories, categoryId]
        }));
    }, []);

    const addTag = useCallback((evento) => {
        if (evento.key === 'Enter' || evento.key === ',') {
            evento.preventDefault();
            const newTag = evento.target.value.trim().toLowerCase();
            if (newTag && !uploadData.tags.includes(newTag)) {
                setUploadData(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
            }
            evento.target.value = '';
        }
    }, [uploadData.tags]);

    const removeTag = useCallback((tagToRemove) => {
        setUploadData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tagToRemove) }));
    }, []);

    const updateFiles = useCallback((name, fileOrFiles) => {
        setUploadFiles((prev) => ({ ...prev, [name]: fileOrFiles }));
        if (uploadErrors[name]) setUploadErrors(prev => ({ ...prev, [name]: null }));
    }, [uploadErrors]);

    const handleFileSelection = useCallback((fieldName, evento, isMultiple = false) => {
        const files = Array.from(evento.target.files);
        if (files.length === 0) return;
        isMultiple
            ? setUploadFiles(prev => ({ ...prev, [fieldName]: [...prev[fieldName], ...files] }))
            : updateFiles(fieldName, files[0]);
    }, [updateFiles]);

    const removeSelectedFile = useCallback((fieldName, evento, index = null) => {
        evento.stopPropagation();
        if (index !== null) {
            setUploadFiles(prev => {
                const newArray = [...prev[fieldName]];
                newArray.splice(index, 1);
                return { ...prev, [fieldName]: newArray };
            });
        } else {
            updateFiles(fieldName, null);
        }
    }, [updateFiles]);

    const clearUploadForm = useCallback(() => {
        setUploadData(initialUploadData);
        setUploadFiles(initialUploadFiles);
        setUploadErrors({});
        setExpandedSections(['info', 'files']);
    }, []);

    const deleteModel = useCallback(async (id) => {
        showConfirm(
            t("models_context.delete_confirmation"),
            async () => {
                setIsUploading(true);
                try {
                    await api.remove(`${apiUrl}/${id}`);

                    setModelsData(prevModels => prevModels.filter(model => String(model.id) !== String(id)));

                    showMessage(t("models_context.model_delete_success"), "success");
                    clearUploadForm();
                    navigate("/profile");
                } catch (error) {
                    console.error("Error al eliminar:", error);
                    showMessage(t("models_context.model_error"), "error");
                } finally {
                    setIsUploading(false);
                }
            }
        );
    }, [api, apiUrl, showConfirm, showMessage, clearUploadForm, navigate]);

    const prepareEdit = useCallback(async (id) => {
        try {
            const response = await api.get(`${apiUrl}/${id}`);
            const modelToEdit = normalizeModelData(response.data);

            if (modelToEdit.username !== currentUser?.username && !isAdmin) {
                showMessage(t("models_context.model_error"), "error");
                navigate("/");
                return;
            }

            const categoryIds = modelToEdit.categories
                .map(categoryName => {
                    const foundCategory = categories.find(c => c.name === categoryName);
                    return foundCategory ? foundCategory.id : null;
                })
                .filter(Boolean);

            setUploadData({
                title: modelToEdit.title,
                description: modelToEdit.description || "",
                categories: categoryIds,
                tags: modelToEdit.tags || []
            });

            setUploadFiles({
                main_file: null,
                main_image: null,
                gallery: [],
                parts: []
            });

            setExistingFiles({
                main_image: modelToEdit.imageUrl,
                main_file: modelToEdit.fileUrl,
                gallery: modelToEdit.gallery || [],
                parts: modelToEdit.parts || []
            });

            setExpandedSections(['info', 'files', 'extras']);

        } catch (error) {
            showMessage(t("models_context.model_error"), "error");
            navigate("/");
        }
    }, [apiUrl, api, currentUser, isAdmin, categories, showMessage, navigate]);

    const editModel = async (id) => {

        const sizeError = validateFileSize(uploadFiles, t);
        if (sizeError) {
            showMessage(sizeError, "warning");
            return false;
        }

        const dataError = validateUploadData(uploadData, uploadFiles, true, t);
        if (dataError) {
            showMessage(dataError, "warning");
            setExpandedSections(['info', 'files', 'extras']);
            return false;
        }

        setIsUploading(true);
        try {
            if (uploadFiles.main_image) {
                const formDataImg = new FormData();
                formDataImg.append("image", uploadFiles.main_image);
                await api.patchForm(`${apiUrl}/${id}/main-image`, formDataImg);
            }

            if (uploadFiles.main_file) {
                const formDataFile = new FormData();
                formDataFile.append("main_file", uploadFiles.main_file);
                await api.patchForm(`${apiUrl}/${id}/main-file`, formDataFile);
            }

            const finalData = {
                title: uploadData.title,
                description: uploadData.description,
                categories: uploadData.categories,
                tags: uploadData.tags,
                main_color: uploadData.main_color,
                license: uploadData.license
            };

            await api.put(`${apiUrl}/${id}`, finalData);

            showMessage(t("models_context.model_update_success"), "success");
            clearUploadForm();
            navigate(`/models/${id}`);
        } catch (error) {
            showMessage(t("models_context.model_error"), "error");
        } finally {
            setIsUploading(false);
        }
    };

    const buildUploadFormData = () => {
        const formData = new FormData();
        formData.append("main_file", uploadFiles.main_file);
        if (uploadFiles.main_image) formData.append("cover_image", uploadFiles.main_image);
        uploadFiles.gallery.forEach(file => formData.append("gallery", file));
        uploadFiles.parts.forEach(file => formData.append("parts", file));
        return formData;
    };

    const uploadModel = async () => {
        const sizeError = validateFileSize(uploadFiles, t);
        if (sizeError) {
            showMessage(sizeError, "warning");
            return false;
        }

        const dataError = validateUploadData(uploadData, uploadFiles, false, t);
        if (dataError) {
            showMessage(dataError, "warning");
            setExpandedSections(['info', 'files', 'extras']);
            return false;
        }

        setIsUploading(true);
        try {
            const serverUrlsResponse = await api.postForm(`${backendUrl}/models/upload`, buildUploadFormData());

            const serverUrls = serverUrlsResponse.data || serverUrlsResponse;

            if (!serverUrls.main_file) {
                throw new Error("No se recibió la URL del archivo principal de Cloudinary.");
            }

            const finalData = {
                title: uploadData.title,
                description: uploadData.description || "",
                categories: uploadData.categories.length > 0 ? uploadData.categories : undefined,
                file_url: serverUrls.main_file,
                main_image_url: serverUrls.cover_image || null,
                gallery: serverUrls.gallery || [],
                parts: serverUrls.parts || [],
            };

            const responseDB = await api.post(`${backendUrl}/models`, finalData);
            const newModel = responseDB.data || responseDB;
            const newModelId = newModel.id;

            if (!newModelId) {
                throw new Error("El backend no devolvió un ID válido para el modelo.");
            }

            if (uploadData.tags && uploadData.tags.length > 0) {
                await Promise.all(uploadData.tags.map(tagStr =>
                    api.post(`${backendUrl}/tags/model/${newModelId}`, { name: tagStr }).catch(() => null)
                ));
            }
            clearUploadForm();
            navigate(`/models/${newModelId}`);
            return true;
        } catch (error) {
            showMessage(t("models_context.model_error"), "error");
            return false;
        } finally {
            setIsUploading(false);
        }
    };

    const updateLikesCount = useCallback((modelId, isAdding) => {
        const safeId = String(modelId);

        setCurrentModel(prev => {
            if (prev && String(prev.id) === safeId) {
                return { ...prev, likes: isAdding ? (prev.likes || 0) + 1 : Math.max(0, (prev.likes || 0) - 1) };
            }
            return prev;
        });

        setModelsData(prev => prev.map(model => {
            if (String(model.id) === safeId) {
                return { ...model, likes: isAdding ? (model.likes || 0) + 1 : Math.max(0, (model.likes || 0) - 1) };
            }
            return model;
        }));
    }, []);

    const updateFavoritesCount = useCallback((modelId, isAdding) => {
        const safeId = String(modelId);

        setCurrentModel(prev => {
            if (prev && String(prev.id) === safeId) {
                return { ...prev, favorites: isAdding ? (prev.favorites || 0) + 1 : Math.max(0, (prev.favorites || 0) - 1) };
            }
            return prev;
        });

        setModelsData(prev => prev.map(model => {
            if (String(model.id) === safeId) {
                return { ...model, favorites: isAdding ? (model.favorites || 0) + 1 : Math.max(0, (model.favorites || 0) - 1) };
            }
            return model;
        }));
    }, []);

    const clearModelsSearch = useCallback(() => {
        setSearchTerm("");
        setActiveCategory("");
        setActiveTag("");
        setSortBy("created_at:desc");
    }, []);

    const visibleTagsModel = (id) => {
        const model = modelsData.find(m => String(m.id) === String(id));
        return model ? model.tags?.slice(0, 3) || [] : [];
    }

    const visibleCategoryModel = (id) => {
        const model = modelsData.find(m => String(m.id) === String(id));
        return model ? model.categories?.[0] || null : null;
    }

    const exportData = {
        models: modelsData,
        pagination,
        currentModel,
        detailUI,
        uploadData,
        uploadFiles,
        uploadErrors,
        expandedSections,
        categories,
        searchTerm, setSearchTerm,
        activeCategory, setActiveCategory,
        activeTag, setActiveTag,
        sortBy, setSortBy,
        sortOptions,
        isSearching,
        isFetchingModel: isInitialLoad || isSearching || api.isLoading,
        modelError: api.error,
        isDownloading: api.isLoading,
        downloadError: api.error,
        isUploading,
        existingFiles,
        fetchModels,
        searchModels,
        fetchModelById,
        updateDetailUI,
        downloadPackage,
        toggleSection,
        updateUploadData,
        toggleCategory,
        addTag,
        removeTag,
        updateFiles,
        handleFileSelection,
        removeSelectedFile,
        clearUploadForm,
        uploadModel,
        getTopPopularModels,
        getRandomModels,
        deleteModel,
        prepareEdit,
        editModel,
        updateLikesCount,
        updateFavoritesCount,
        clearModelsSearch,
        visibleTagsModel,
        visibleCategoryModel,
        categoriasDisponibles: categories,
        getModels: fetchModels,
        getModelById: fetchModelById,
        actualizarDatoSubida: updateUploadData,
        toggleCategoria: toggleCategory,
        agregarTag: addTag,
        eliminarTag: removeTag,
        actualizarArchivos: updateFiles,
        manejarSeleccionArchivo: handleFileSelection,
        eliminarArchivoSeleccionado: removeSelectedFile,
        limpiarFormularioSubida: clearUploadForm,
        subirModelo: uploadModel,
        borrarModelo: deleteModel,
        prepararEdicion: prepareEdit,
        editarModelo: editModel,
        archivosExistentes: existingFiles,

    };

    return <modelContext.Provider value={exportData}>{children}</modelContext.Provider>;
};

export { modelContext };
export default ModelsMeiliContext;