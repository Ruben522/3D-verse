import React, { useState, useEffect, createContext } from "react";
import useAPI from "../hooks/useAPI.js";

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
  };

  return <model.Provider value={exportData}>{children}</model.Provider>;
};

export { model };
export default ModelsContext;