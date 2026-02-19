import React,{ createContext, useContext, useEffect, useState } from "react";
import { traerDatos } from "../data/TraerDatos";

const ModelsContext = createContext();

const MODELS_URL = "http://localhost:3000/models";

export const ModelsProvider = ({ children }) => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarModelos = async () => {
    try {
      const data = await traerDatos(MODELS_URL);
      setModels(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarModelos();
  }, []);

  /**
   * Obtiene un modelo por ID desde el estado
   * (sin volver a hacer fetch)
   */
  const getModelById = (id) => {
    return models.find((model) => model.id === id);
  };

  const exportar = {models,
        loading,
        error,
        getModelById,}

  return (
    <ModelsContext value={exportar}>{children}</ModelsContext>);
};

export default ModelsProvider;
export { ModelsContext };
