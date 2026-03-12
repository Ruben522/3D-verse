import React, { useState, useEffect, createContext } from "react";
import useAPI from "../hooks/useAPI.js";

const model = createContext();

const ModelsContext = ({ children }) => {
  const [models, setModels] = useState([]);
  const [currentModel, setCurrentModel] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 1,
  });

  //const backendUrl = "http://localhost:3000" 
  //const apiUrl = `${backendUrl}/models`;
  const apiUrl = import.meta.env.VITE_API_URL + "/models";

  const { isLoading,
    error,
    get,
    post,
    put,
    patch,
    remove, } = useAPI();

  const normalizeModelData = (model) => {
    return {
      id: model.id,
      username: model.author?.username || "Desconocido",
      avatarUrl: model.author?.avatar || null,
      createdDate: new Date(model.created_at).toLocaleDateString(),
      description: model.description,
      downloads: model.downloads || 0,
      fileUrl: model.file_url ? `${backendUrl}${model.file_url}` : null,
      imageUrl: model.main_image_url ? `${backendUrl}${model.main_image_url}` : null,
      title: model.title,
      updated_at: model.updated_at,
      videoUrl: model.video_url,
      views: model.views,
      license: model.license,
      mainColor: model.main_color,
      likes: model._count?.model_likes || 0,
      categories: model.model_category?.map((c) => c.categories?.name) || [],
      tags: model.model_tag?.map((t) => t.tags?.name) || [],
      gallery: model.model_images
        ?.sort((a, b) => a.display_order - b.display_order)
        .map((img) => `${backendUrl}${img.image_url}`) || [],
      parts: model.model_parts?.map((p) => ({
        id: p.id,
        name: p.part_name,
        fileUrl: p.file_url ? `${backendUrl}${p.file_url}` : null,
        color: p.color,
      })) || [],
    };
  };

  const getModels = async () => {
    try {
      const data = await get(apiUrl);
      const normalizedData = data.data.data.map(normalizeModelData);
      setModels(normalizedData);
      setPagination({
        page: data.data.page,
        total: data.data.total,
        totalPages: data.data.totalPages,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const getModelById = async (id) => {
    try {
      setCurrentModel(null);
      const data = await get(`${apiUrl}/${id}`);
      setCurrentModel(normalizeModelData(data.data));
    } catch (err) {
      console.error(err);
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
    isLoading,
    error,
  };

  return (
    <model.Provider value={exportData}>
      {children}
    </model.Provider>
  );
};

export { model };
export default ModelsContext;