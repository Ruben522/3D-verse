import React, { useState, useEffect, createContext } from "react";
import useAPI from "../hooks/useAPI.js";
import { useNavigate } from "react-router-dom";
import { validateUploadData } from "../utils/uploadValidations";
import useMessage from "../hooks/useMessage.js";
import { Meilisearch } from 'meilisearch';
import { normalizeMeiliHit, normalizeModelData } from "../utils/normalizers";
import { meiliClient, modelsIndex } from "../services/meiliClient.js";

const model = createContext();

const ModelsMeiliContext = ({ children }) => {
    const navegar = useNavigate();
    const modelAPI = useAPI();
    const actionAPI = useAPI();
    const { showMessage } = useMessage();

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

    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const apiUrl = `${backendUrl}/models`;

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
                file_url: urlsDelServidor.data?.main_file || urlsDelServidor.main_file,
                main_image_url: urlsDelServidor.data?.cover_image || urlsDelServidor.cover_image || null,
                gallery: urlsDelServidor.data?.gallery || urlsDelServidor.gallery || [],
                parts: urlsDelServidor.data?.parts || urlsDelServidor.parts || [],
            };

            const responseDB = await actionAPI.post(`${backendUrl}/models`, finalData);
            const newModelId = responseDB.data?.id || responseDB.id;

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
        isSearching,
        isFetchingModel: modelAPI.isLoading || isSearching,
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
    };

    return <model.Provider value={exportData}>{children}</model.Provider>;
};

export { model };
export default ModelsMeiliContext;