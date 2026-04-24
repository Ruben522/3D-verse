import { Meilisearch } from 'meilisearch'; // <--- Ojo, Meilisearch con 's' minúscula

// Nos conectamos al servidor de Meilisearch local
export const client = new Meilisearch({
  host: 'http://localhost:7700',
  apiKey: 'MiClaveSecreta123!', 
});

// Definimos el índice
export const modelsIndex = client.index('models');

// Función para configurar el buscador
export const setupMeilisearch = async () => {
  try {
    await modelsIndex.updateSearchableAttributes([
      'title',
      'description',
      'category_names',
      'tag_names',
      'author_username'
    ]);

    await modelsIndex.updateFilterableAttributes([
      'category_names',
      'license',
      'author_username'
    ]);

    console.log('✅ Meilisearch configurado correctamente');
  } catch (error) {
    console.error('❌ Error configurando Meilisearch:', error);
  }
};