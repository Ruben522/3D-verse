import React, { useState, useEffect, createContext } from "react";
import useAPI from "../hooks/useAPI.js";
import { useNavigate } from "react-router-dom";
import { validateUploadData } from "../utils/uploadValidations";

const model = createContext();
const ModelsContext = ({ children }) => {
  const [models, setModels] = useState([]);
  const [currentModel, setCurrentModel] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });

  const modelAPI = useAPI();
  const actionAPI = useAPI();

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
  const navegar = useNavigate();

  const updateDetailUI = (field, value) => {
    setDetailUI((prev) => {
      const newState = { ...prev, [field]: value };
      if (field === 'activeMediaTab' || field === 'active3DUrl') {
        newState.isInteractive = false;
      }
      return newState;
    });
  };

  const backendUrl = "http://localhost:3000";
  const apiUrl = `${backendUrl}/models`;

  const normalizeModelData = (modelData) => {
    const formatUrl = (path) => {
      if (!path) return null;
      if (path.startsWith('http')) return path;
      const cleanBase = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      return `${cleanBase}${cleanPath}`;
    };

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

  const getModels = async () => {
    try {
      const data = await modelAPI.get(apiUrl);
      const normalizedData = data.data.data.map(normalizeModelData);
      setModels(normalizedData);
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
  useEffect(() => {
    getModels();
  }, []);
  const initialUploadData = {
    title: "",
    description: "",
    category_id: "", // Se llenará con el select
    tags: [] // Array de strings
  };

  // Estado inicial de los archivos
  const initialUploadFiles = {
    main_file: null,
    main_image: null,
    gallery: [], // Array de archivos
    parts: []    // Array de archivos
  };

  const [uploadData, setUploadData] = useState(initialUploadData);
  const [uploadFiles, setUploadFiles] = useState(initialUploadFiles);
  const [uploadErrors, setUploadErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  // --------------------------------------------------------
  // MANEJADORES DE ESTADO (Siguiendo tu patrón de Login)
  // --------------------------------------------------------
  const [expandedSections, setExpandedSections] = useState(['info', 'files']);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // Para inputs de texto normales (title, description, category_id)
  const actualizarDatoSubida = (evento) => {
    const { name, value } = evento.target;
    setUploadData((prev) => ({ ...prev, [name]: value }));
    // Limpiamos el error de ese campo si lo hubiera al empezar a escribir
    if (uploadErrors[name]) setUploadErrors(prev => ({ ...prev, [name]: null }));
  };

  // Para los tags (que son un array)
  const actualizarTags = (newTagsArray) => {
    setUploadData(prev => ({ ...prev, tags: newTagsArray }));
  };

  // Para guardar los archivos arrastrados o seleccionados
  const actualizarArchivos = (name, fileOrFiles) => {
    setUploadFiles((prev) => ({ ...prev, [name]: fileOrFiles }));
    if (uploadErrors[name]) setUploadErrors(prev => ({ ...prev, [name]: null }));
  };

  const limpiarFormularioSubida = () => {
    setUploadData(initialUploadData);
    setUploadFiles(initialUploadFiles);
    setUploadErrors({});
    setExpandedSections(['info', 'files']);
  };

  // --------------------------------------------------------
  // LA FUNCIÓN MAESTRA DE SUBIDA (2 PASOS)
  // --------------------------------------------------------
  // --------------------------------------------------------
  // LA FUNCIÓN MAESTRA DE SUBIDA (2 PASOS)
  // --------------------------------------------------------
  const subirModelo = async () => {
    const validation = validateUploadData(uploadData, uploadFiles);
    if (!validation.isValid) {
      setUploadErrors(validation.errors);
      setExpandedSections(['info', 'files', 'extras']);
      return false;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();

      // Adjuntamos archivos
      formData.append("main_file", uploadFiles.main_file);
      formData.append("cover_image", uploadFiles.main_image);

      uploadFiles.gallery.forEach(file => formData.append("gallery", file));
      uploadFiles.parts.forEach(file => formData.append("parts", file));

      // PASO 1: Subimos los archivos
      const uploadResponse = await actionAPI.postForm(`${backendUrl}/models/upload`, formData);
      const urlsDelServidor = uploadResponse.data || uploadResponse;

      // EXTRACCIÓN BLINDADA: Buscamos la URL en todas las posibles claves que tu backend pueda devolver
      const urlArchivoPrincipal = urlsDelServidor.file_url || urlsDelServidor.main_file_url || urlsDelServidor.main_file;
      const urlImagenPrincipal = urlsDelServidor.main_image_url || urlsDelServidor.cover_image_url || urlsDelServidor.cover_image || urlsDelServidor.main_image;
      const urlsGaleria = urlsDelServidor.gallery_urls || urlsDelServidor.gallery || [];
      const urlsPartes = urlsDelServidor.parts_urls || urlsDelServidor.parts || [];

      // PASO 2: Crear el registro en la BD
      const finalData = {
        title: uploadData.title,
        description: uploadData.description,
        category_id: uploadData.category_id,
        tags: uploadData.tags,

        // Enviamos la URL del archivo bajo las dos claves más comunes para que tu validador no falle
        file_url: urlArchivoPrincipal,
        main_file_url: urlArchivoPrincipal,

        // Lo mismo con la imagen
        main_image_url: urlImagenPrincipal,
        cover_image_url: urlImagenPrincipal,

        gallery_urls: urlsGaleria,
        parts_urls: urlsPartes
      };

      const createResponse = await actionAPI.post(`${backendUrl}/models`, finalData);

      limpiarFormularioSubida();

      const newModelId = createResponse.data?.id || createResponse.id;
      navegar(`/models/${newModelId}`);

      return true;
    } catch (error) {
      console.error("Error en el proceso de subida:", error);
      // Extraemos el mensaje de error real del backend si existe
      const mensajeError = error.message || "Hubo un error al procesar tu diseño. Inténtalo de nuevo.";
      setUploadErrors({ global: mensajeError });
      return false;
    } finally {
      setIsUploading(false);
    }
  };
  const checkSectionErrors = (sectionId) => {
    if (!uploadErrors || Object.keys(uploadErrors).length === 0) return false;

    const keys = Object.keys(uploadErrors);
    if (sectionId === 'info') return keys.some(k => ['title', 'description', 'category_id'].includes(k));
    if (sectionId === 'files') return keys.some(k => ['main_file', 'main_image'].includes(k));
    return false;
  };
  const categoriasDisponibles = [
    { id: "1", name: "Personajes / Miniaturas" },
    { id: "2", name: "Accesorios / Props" },
    { id: "3", name: "Hogar / Decoración" },
    { id: "4", name: "Herramientas" }
  ];
  const manejarSeleccionArchivo = (nombreCampo, evento) => {
    const file = evento.target.files[0];
    if (file) {
      actualizarArchivos(nombreCampo, file);
    }
  };

  const eliminarArchivoSeleccionado = (nombreCampo, evento) => {
    evento.stopPropagation(); // Evita que se abra la ventana de Windows al hacer clic en borrar
    actualizarArchivos(nombreCampo, null);
  };
  const exportData = {
    models,
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
    actualizarDatoSubida,
    actualizarTags,
    actualizarArchivos,
    limpiarFormularioSubida,
    subirModelo,
    checkSectionErrors,
    expandedSections,
    toggleSection,
    categoriasDisponibles,
    manejarSeleccionArchivo,
    eliminarArchivoSeleccionado

  };

  return <model.Provider value={exportData}>{children}</model.Provider>;
};

export { model };
export default ModelsContext;