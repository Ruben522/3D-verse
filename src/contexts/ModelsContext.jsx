import React, { useState, useEffect, createContext } from "react";
import useAPI from "../hooks/useAPI.js";

const model = createContext();

const ModelsContext = ({ children }) => {
  const [models, setModels] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 1,
  });

  const API_URL = "http://localhost:3000/models";

  const { get, isLoading, error } = useAPI();

  const fetchModels = async () => {
    try {
      const data = await get(API_URL);
      setModels(data.data);
      setPagination({
        page: data.page,
        total: data.total,
        totalPages: data.totalPages,
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const exportData = {
    models,
    pagination,
    fetchModels,
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