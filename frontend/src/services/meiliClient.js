import { Meilisearch } from 'meilisearch';

export const meiliClient = new Meilisearch({
  host: import.meta.env.VITE_MEILI_URL || "http://localhost:7700",
  apiKey: import.meta.env.VITE_MEILI_KEY || "MiClaveSecreta123!",
});

export const modelsIndex = meiliClient.index("models");
export const usersIndex = meiliClient.index("users");