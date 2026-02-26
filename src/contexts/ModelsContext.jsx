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

  const API_URL = "http://localhost:3000/models";

  const { get, isLoading, error } = useAPI();

  const normalizeModelData = (model) => ({
    ...model,
    displayTitle: model.title || "Untitled",
    displayImage: model.main_image_url || model.image_url,
    creatorName: model.creator?.username || "MakerPro",
    avatarUrl: model.creator?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${model.id}`,
    likes: model.likes || 0,
    downloads: model.downloads || 0,
    publishDate: model.created_at ? new Date(model.created_at).toLocaleDateString() : "Unknown",
  });

  const getModels = async () => {
    try {
      const data = await get(API_URL);
      const normalizedData = data.map(normalizeModelData);

      setModels(normalizedData);
      setPagination({
        page: data.page,
        total: data.total,
        totalPages: data.totalPages,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const getModelById = async (id) => {
    try {
      const data = await get(`${API_URL}/${id}`);
      setCurrentModel(normalizeModelData(data));
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