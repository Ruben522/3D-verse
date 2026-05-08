import React, { useState, useEffect, createContext } from "react";
import useUsers from "../hooks/useUsers.js";
import useAPI from "../hooks/useAPI.js";
import { useNavigate } from "react-router-dom";
import { validateUploadData } from "../utils/uploadValidations";
import useMessage from "../hooks/useMessage.js";
import { normalizeMeiliHit, normalizeModelData } from "../utils/normalizers";
import { modelsIndex } from "../services/meiliClient.js";

const model = createContext();

const ModelsMeiliContext = ({ children }) => {
    const navegar = useNavigate();
    const modelAPI = useAPI();
    const actionAPI = useAPI();
    const { currentUser } = useUsers();
    const { showMessage, showConfirm } = useMessage();
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [modelsData, setModelsData] = useState([]);
    const [currentModel, setCurrentModel] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });
    const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("");
    const [activeTag, setActiveTag] = useState("");
    const [sortBy, setSortBy] = useState("created_at:desc");
    const [isSearching, setIsSearching] = useState(false);
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
    const initialUploadData = { title: "", description: "", categories: [], tags: [] };
    const initialUploadFiles = { main_file: null, main_image: null, gallery: [], parts: [] };
    const [uploadData, setUploadData] = useState(initialUploadData);
    const [uploadFiles, setUploadFiles] = useState(initialUploadFiles);
    const [uploadErrors, setUploadErrors] = useState({});
    const [isUploading, setIsUploading] = useState(false);
    const [expandedSections, setExpandedSections] = useState(['info', 'files']);
    const [archivosExistentes, setArchivosExistentes] = useState(null);

    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const apiUrl = `${backendUrl}/models`;

    const sortOptions = [
        { value: "created_at:desc", label: "Recientes" },
        { value: "likes_count:desc", label: "Populares" },
        { value: "downloads:desc", label: "Descargas" },
    ];

    useEffect(() => {
        getCategories();
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            searchModels(searchTerm, 1);
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, activeCategory, activeTag, sortBy]);

    const getCategories = async () => {
        try {
            const response = await modelAPI.get(`${backendUrl}/categories`);
            setCategoriasDisponibles(response.data || []);
        } catch (err) {
            showMessage("Error al obtener categorías.", "error");
            setCategoriasDisponibles([]);
        }
    };

    const getModels = async (page = 1) => {
        return searchModels(searchTerm, page);
    };

    const searchModels = async (query = "", page = 1) => {
        setIsSearching(true);
        try {
            const searchParams = {
                hitsPerPage: 12,
                page: page,
                sort: [sortBy],
                filter: []
            };

            if (activeCategory) searchParams.filter.push(`category_names = "${activeCategory}"`);
            if (activeTag) searchParams.filter.push(`tag_names = "${activeTag}"`);

            const results = await modelsIndex.search(query, searchParams);
            setModelsData(results.hits.map(normalizeMeiliHit));
            setPagination({
                page: results.page,
                total: results.totalHits,
                totalPages: results.totalPages
            });
        } catch (err) {
            console.error("Error en Meilisearch:", err);
        } finally {
            setIsSearching(false);
            setIsInitialLoad(false);
        }
    };

    const getModelById = async (id) => {
        try {
            setCurrentModel(null);
            const data = await modelAPI.get(`${apiUrl}/${id}`);
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
            showMessage("Error al cargar el modelo. Inténtalo de nuevo.", "error");
        }
    };

    const updateDetailUI = (field, value) => {
        setDetailUI((prev) => {
            const newState = { ...prev, [field]: value };
            if (field === 'activeMediaTab' || field === 'active3DUrl') {
                newState.isInteractive = false;
            }
            return newState;
        });
    };

    const downloadPackage = async (modelId, packageType) => {
        try {
            const url = `${backendUrl}/downloads/${modelId}?type=${packageType}`;
            const fileName = `${currentModel.title}.zip`;
            await actionAPI.downloadPost(url, fileName);
        } catch (err) {
            showMessage("Error al descargar el paquete.", "error");
        }
    };

    const toggleSection = (sectionId) => setExpandedSections(prev => prev.includes(sectionId) ? prev.filter(id => id !== sectionId) : [...prev, sectionId]);

    const actualizarDatoSubida = (evento) => {
        const { name, value } = evento.target;
        setUploadData((prev) => ({ ...prev, [name]: value }));
        if (uploadErrors[name]) setUploadErrors(prev => ({ ...prev, [name]: null }));
    };

    const toggleCategoria = (categoryId) => setUploadData(prev => ({ ...prev, categories: prev.categories.includes(categoryId) ? prev.categories.filter(id => id !== categoryId) : [...prev.categories, categoryId] }));

    const agregarTag = (evento) => {
        if (evento.key === 'Enter' || evento.key === ',') {
            evento.preventDefault();
            const nuevoTag = evento.target.value.trim().toLowerCase();
            if (nuevoTag && !uploadData.tags.includes(nuevoTag)) setUploadData(prev => ({ ...prev, tags: [...prev.tags, nuevoTag] }));
            evento.target.value = '';
        }
    };

    const eliminarTag = (tagAEliminar) => setUploadData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tagAEliminar) }));

    const actualizarArchivos = (name, fileOrFiles) => {
        setUploadFiles((prev) => ({ ...prev, [name]: fileOrFiles }));
        if (uploadErrors[name]) setUploadErrors(prev => ({ ...prev, [name]: null }));
    };

    const manejarSeleccionArchivo = (nombreCampo, evento, isMultiple = false) => {
        const files = Array.from(evento.target.files);
        if (files.length === 0) return;
        isMultiple ? setUploadFiles(prev => ({ ...prev, [nombreCampo]: [...prev[nombreCampo], ...files] })) : actualizarArchivos(nombreCampo, files[0]);
    };

    const eliminarArchivoSeleccionado = (nombreCampo, evento, index = null) => {
        evento.stopPropagation();
        if (index !== null) {
            setUploadFiles(prev => {
                const nuevoArray = [...prev[nombreCampo]];
                nuevoArray.splice(index, 1);
                return { ...prev, [nombreCampo]: nuevoArray };
            });
        } else {
            actualizarArchivos(nombreCampo, null);
        }
    };

    const limpiarFormularioSubida = () => {
        setUploadData(initialUploadData);
        setUploadFiles(initialUploadFiles);
        setUploadErrors({});
        setExpandedSections(['info', 'files']);
    };

    const borrarModelo = async (id) => {
        showConfirm(
            "¿Estás seguro de que quieres eliminar este modelo? Esta acción es irreversible y borrará todos los archivos asociados.",
            async () => {
                setIsUploading(true);
                try {
                    await actionAPI.remove(`${apiUrl}/${id}`);

                    showMessage("Modelo eliminado correctamente", "success");
                    limpiarFormularioSubida();
                    navegar("/profile");
                } catch (error) {
                    console.error("Error al eliminar:", error);
                    showMessage("No se pudo eliminar el modelo.", "error");
                } finally {
                    setIsUploading(false);
                }
            }
        );
    };

    const prepararEdicion = async (id) => {
        try {
            const response = await modelAPI.get(`${apiUrl}/${id}`);
            const modelToEdit = normalizeModelData(response.data);

            if (modelToEdit.username !== currentUser?.username && modelToEdit.user_id !== currentUser?.id) {
                showMessage("No tienes permiso para editar este modelo.", "error");
                navegar("/");
                return;
            }

            const categoryIds = modelToEdit.categories
                .map(nombreCategoria => {
                    const categoriaEncontrada = categoriasDisponibles.find(c => c.name === nombreCategoria);
                    return categoriaEncontrada ? categoriaEncontrada.id : null;
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

            setArchivosExistentes({
                main_image: modelToEdit.imageUrl,
                main_file: modelToEdit.fileUrl,
                gallery: modelToEdit.gallery || [],
                parts: modelToEdit.parts || []
            });

            setExpandedSections(['info', 'files', 'extras']);

        } catch (error) {
            console.error("Error en prepararEdicion:", error);
            showMessage("No se pudieron cargar los datos del modelo para editar.", "error");
            navegar("/");
        }
    };

    const editarModelo = async (id) => {
        setIsUploading(true);
        try {
            if (uploadFiles.main_image) {
                const formDataImg = new FormData();
                formDataImg.append("image", uploadFiles.main_image);
                await actionAPI.patchForm(`${apiUrl}/${id}/main-image`, formDataImg);
            }

            if (uploadFiles.main_file) {
                const formDataFile = new FormData();
                formDataFile.append("main_file", uploadFiles.main_file);
                await actionAPI.patchForm(`${apiUrl}/${id}/main-file`, formDataFile);
            }

            const finalData = {
                title: uploadData.title,
                description: uploadData.description,
                categories: uploadData.categories,
                tags: uploadData.tags,
                main_color: uploadData.main_color,
                license: uploadData.license
            };

            await actionAPI.put(`${apiUrl}/${id}`, finalData);

            showMessage("¡Cambios guardados correctamente!", "success");
            limpiarFormularioSubida();
            navegar(`/models/${id}`);
        } catch (error) {
            console.error("Error editando:", error);
            showMessage("No se pudieron guardar los cambios.", "error");
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

    const subirModelo = async () => {
        const validation = validateUploadData(uploadData, uploadFiles);
        if (!validation.isValid) {
            setUploadErrors(validation.errors);
            setExpandedSections(['info', 'files', 'extras']);
            return false;
        }

        setIsUploading(true);
        try {
            const urlsDelServidor = await actionAPI.postForm(`${backendUrl}/models/upload`, buildUploadFormData());

            const finalData = {
                title: uploadData.title,
                description: uploadData.description || "",
                categories: uploadData.categories.length > 0 ? uploadData.categories : undefined,
                file_url: urlsDelServidor.data?.main_file ?? urlsDelServidor.main_file,
                main_image_url: urlsDelServidor.data?.cover_image ?? urlsDelServidor.cover_image ?? null,
                gallery: urlsDelServidor.data?.gallery ?? urlsDelServidor.gallery ?? [],
                parts: urlsDelServidor.data?.parts ?? urlsDelServidor.parts ?? [],
            };

            const responseDB = await actionAPI.post(`${backendUrl}/models`, finalData);
            const newModelId = responseDB.data?.id ?? responseDB.id;

            if (uploadData.tags && uploadData.tags.length > 0) {
                await Promise.all(uploadData.tags.map(tagStr => actionAPI.post(`${backendUrl}/tags/model/${newModelId}`, { name: tagStr }).catch(() => null)));
            }

            limpiarFormularioSubida();
            navegar(`/models/${newModelId}`);
            return true;
        } catch (error) {
            showMessage("Error al procesar tu diseño. Inténtalo de nuevo.", "error");
            setUploadErrors({ global: error.message || "Hubo un error al procesar tu diseño." });
            return false;
        } finally {
            setIsUploading(false);
        }
    };

    const getTopPopularModels = () => {
        if (!modelsData || modelsData.length === 0) return [];
        return [...modelsData].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 5);
    };

    const getRandomModels = () => {
        if (!modelsData || modelsData.length === 0) return [];
        const modelsWithImages = modelsData.filter(m => m.imageUrl);
        return [...modelsWithImages].sort(() => 0.5 - Math.random()).slice(0, 10);
    };

    const exportData = {
        models: modelsData,
        pagination,
        currentModel,
        detailUI,
        uploadData,
        uploadFiles,
        uploadErrors,
        expandedSections,
        categoriasDisponibles,
        searchTerm, setSearchTerm,
        activeCategory, setActiveCategory,
        activeTag, setActiveTag,
        sortBy, setSortBy,
        sortOptions,
        isSearching,
        isFetchingModel: isInitialLoad || isSearching || modelAPI.isLoading,
        modelError: modelAPI.error,
        isDownloading: actionAPI.isLoading,
        downloadError: actionAPI.error,
        isUploading,
        getModels,
        searchModels,
        getModelById,
        updateDetailUI,
        downloadPackage,
        toggleSection,
        actualizarDatoSubida,
        toggleCategoria,
        agregarTag,
        eliminarTag,
        actualizarArchivos,
        manejarSeleccionArchivo,
        eliminarArchivoSeleccionado,
        limpiarFormularioSubida,
        subirModelo,
        getTopPopularModels,
        getRandomModels,
        borrarModelo,
        prepararEdicion,
        editarModelo,
        archivosExistentes,
    };

    return <model.Provider value={exportData}>{children}</model.Provider>;
};

export { model };
export default ModelsMeiliContext;