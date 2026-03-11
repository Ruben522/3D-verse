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

  const get = (url) => request(url, { method: "GET" });

  const post = (url, body) =>
    request(url, {
      method: "POST",
      body: JSON.stringify(body),
    });

  const put = (url, body) =>
    request(url, {
      method: "PUT",
      body: JSON.stringify(body),
    });

  const patch = (url, body) =>
    request(url, {
      method: "PATCH",
      body: JSON.stringify(body),
    });

  const remove = (url) =>
    request(url, {
      method: "DELETE",
    });

  return {
    isLoading,
    error,
    get,
    post,
    put,
    patch,
    remove,
  };
};

export default useAPI;
