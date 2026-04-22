import React, { useState, useEffect, createContext } from "react";
import useAPI from "../hooks/useAPI.js";
import { useNavigate } from "react-router-dom";
import { validateUploadData } from "../utils/uploadValidations";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
const apiUrl = `${backendUrl}/models`;

const initialUploadData = {
  title: "",
  description: "",
  categories: [],
  tags: []
};

const initialUploadFiles = {
  main_file: null,
  main_image: null,
  gallery: [],
  parts: []
};

const formatUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const cleanBase = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
};

const normalizeModelData = (modelData) => {
  return {
    id: modelData.id,
    username: modelData.author?.username || "Desconocido",
    avatarUrl: formatUrl(modelData.author?.avatar),
    createdDate: new Date(modelData.created_at).toLocaleDateString(),
    description: modelData.description,
    downloads: modelData.downloads || 0,
    fileUrl: formatUrl(modelData.file_url),
    imageUrl: formatUrl(modelData.main_image_url),
    title: modelData.title,
    updated_at: modelData.updated_at,
    videoUrl: modelData.video_url,
    views: modelData.views,
    license: modelData.license,
    mainColor: modelData.main_color,
    likes: modelData._count?.model_likes || 0,
    categories: modelData.model_category?.map((c) => c.categories?.name) || [],
    tags: modelData.model_tag?.map((t) => t.tags?.name) || [],
    gallery: modelData.model_images
      ?.sort((a, b) => a.display_order - b.display_order)
      .map((img) => formatUrl(img.image_url)) || [],
    parts: modelData.model_parts?.map((p) => ({
      id: p.id,
      name: p.part_name,
      fileUrl: formatUrl(p.file_url),
      color: p.color,
    })) || [],
  };
};

const model = createContext();

const ModelsContext = ({ children }) => {
  const navegar = useNavigate();
  const modelAPI = useAPI();
  const actionAPI = useAPI();

  const [modelsData, setModelsData] = useState([]);
  const [currentModel, setCurrentModel] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });

  const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);

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

  useEffect(() => {
    getModels();
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      const response = await modelAPI.get(`${backendUrl}/categories`);
      setCategoriasDisponibles(response.data || []);
    } catch (err) {
      console.error("Error al obtener categorías:", err);
      setCategoriasDisponibles([]);
    }
  };

  const getModels = async () => {
    try {
      const data = await modelAPI.get(apiUrl);
      const normalizedData = data.data.data.map(normalizeModelData);
      setModelsData(normalizedData);
      setPagination({ page: data.data.page, total: data.data.total, totalPages: data.data.totalPages });
    } catch (err) {
      console.error(err);
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
      console.error("Error crítico de carga:", err);
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
      const tituloOriginal = currentModel.title;
      const fileName = `${tituloOriginal}.zip`;
      await actionAPI.downloadPost(url, fileName);
    } catch (err) {
      console.error("Fallo en la descarga:", err);
    }
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const actualizarDatoSubida = (evento) => {
    const { name, value } = evento.target;
    setUploadData((prev) => ({ ...prev, [name]: value }));
    if (uploadErrors[name]) setUploadErrors(prev => ({ ...prev, [name]: null }));
  };

  const toggleCategoria = (categoryId) => {
    setUploadData(prev => {
      const isSelected = prev.categories.includes(categoryId);
      const newCategories = isSelected
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId];

      return { ...prev, categories: newCategories };
    });
  };

  const agregarTag = (evento) => {
    if (evento.key === 'Enter' || evento.key === ',') {
      evento.preventDefault();
      const nuevoTag = evento.target.value.trim().toLowerCase();
      if (nuevoTag && !uploadData.tags.includes(nuevoTag)) {
        setUploadData(prev => ({ ...prev, tags: [...prev.tags, nuevoTag] }));
      }
      evento.target.value = '';
    }
  };

  const eliminarTag = (tagAEliminar) => {
    setUploadData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tagAEliminar) }));
  };

  const actualizarArchivos = (name, fileOrFiles) => {
    setUploadFiles((prev) => ({ ...prev, [name]: fileOrFiles }));
    if (uploadErrors[name]) setUploadErrors(prev => ({ ...prev, [name]: null }));
  };

  const manejarSeleccionArchivo = (nombreCampo, evento, isMultiple = false) => {
    const files = Array.from(evento.target.files);
    if (files.length === 0) return;

    if (isMultiple) {
      setUploadFiles(prev => ({
        ...prev,
        [nombreCampo]: [...prev[nombreCampo], ...files]
      }));
    } else {
      actualizarArchivos(nombreCampo, files[0]);
    }
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

    if (uploadFiles.main_image) {
      formData.append("cover_image", uploadFiles.main_image);
    }
    uploadFiles.gallery.forEach(file => formData.append("gallery", file));
    uploadFiles.parts.forEach(file => formData.append("parts", file));

    return formData;
  };

  const uploadFilesToServer = async (formData) => {
    const response = await actionAPI.postForm(`${backendUrl}/models/upload`, formData);
    return response.data || response;
  };

  const buildFinalModelData = (urlsDelServidor) => {
    const urlArchivoPrincipal = urlsDelServidor.main_file;
    const urlImagenPrincipal = urlsDelServidor.cover_image || null;

    const urlsGaleria = urlsDelServidor.gallery || [];
    const urlsPartes = urlsDelServidor.parts || [];

    return {
      title: uploadData.title,
      description: uploadData.description || "",
      categories: uploadData.categories.length > 0 ? uploadData.categories : undefined,

      file_url: urlArchivoPrincipal,
      main_image_url: urlImagenPrincipal,
      gallery: urlsGaleria,
      parts: urlsPartes,
    };
  };

  const saveModelToDB = async (finalData) => {
    const response = await actionAPI.post(`${backendUrl}/models`, finalData);
    return response.data?.id || response.id;
  };

  const saveModelTags = async (modelId) => {
    if (!uploadData.tags || uploadData.tags.length === 0) return;

    await Promise.all(
      uploadData.tags.map(async (tagStr) => {
        try {
          await actionAPI.post(`${backendUrl}/tags/model/${modelId}`, { name: tagStr });
        } catch (errTag) {
          console.error(`Error al guardar el tag ${tagStr}:`, errTag);
        }
      })
    );
  };

  const handleUploadValidationFailed = (errors) => {
    setUploadErrors(errors);
    setExpandedSections(['info', 'files', 'extras']);
  };

  const handleUploadSuccess = (newModelId) => {
    limpiarFormularioSubida();
    navegar(`/models/${newModelId}`);
  };

  const handleUploadError = (error) => {
    console.error("Error en el proceso de subida:", error);
    const mensajeError = error.message || "Hubo un error al procesar tu diseño. Inténtalo de nuevo.";
    setUploadErrors({ global: mensajeError });
  };

  const subirModelo = async () => {
    const validation = validateUploadData(uploadData, uploadFiles);
    if (!validation.isValid) {
      handleUploadValidationFailed(validation.errors);
      return false;
    }

    setIsUploading(true);

    try {
      const formData = buildUploadFormData();
      const urlsDelServidor = await uploadFilesToServer(formData);
      const finalData = buildFinalModelData(urlsDelServidor);
      const newModelId = await saveModelToDB(finalData);
      console.log("✅ Respuesta del upload:", urlsDelServidor);
      await saveModelTags(newModelId);

      handleUploadSuccess(newModelId);
      return true;

    } catch (error) {
      handleUploadError(error);
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  const exportData = {
    models: modelsData,
    pagination,
    getModels,
    currentModel,
    getModelById,
    detailUI,
    updateDetailUI,
    downloadPackage,
    isFetchingModel: modelAPI.isLoading,
    modelError: modelAPI.error,
    isDownloading: actionAPI.isLoading,
    downloadError: actionAPI.error,
    uploadData,
    uploadFiles,
    uploadErrors,
    isUploading,
    expandedSections,
    categoriasDisponibles,
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
  };

  return <model.Provider value={exportData}>{children}</model.Provider>;
};

export { model };
export default ModelsContext;