import { useState } from "react";

export const useAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = async (url, options = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(
          `Request error ${response.status}: ${response.statusText}`,
        );
      }

      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const downloadFile = async (url, filename, options = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token"); 
      const headers = token ? { "Authorization": `Bearer ${token}` } : {};

      const response = await fetch(url, { headers, ...options });

      if (!response.ok) {
        throw new Error(
          `Error en la descarga ${response.status}: ${response.statusText}`,
        );
      }

      const blob = await response.blob();
      
      const objectUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      window.URL.revokeObjectURL(objectUrl);
      a.remove();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const get = (url) => request(url, { method: "GET" });
  const post = (url, body) => request(url, { method: "POST", body: JSON.stringify(body) });
  const put = (url, body) => request(url, { method: "PUT", body: JSON.stringify(body) });
  const patch = (url, body) => request(url, { method: "PATCH", body: JSON.stringify(body) });
  const remove = (url) => request(url, { method: "DELETE" });
  const downloadGet = (url, filename) => downloadFile(url, filename, { method: "GET" });
  const downloadPost = (url, filename) => downloadFile(url, filename, { method: "POST" });

  return {
    isLoading,
    error,
    get,
    post,
    put,
    patch,
    remove,
    downloadGet,
    downloadPost,
  };
};

export default useAPI;