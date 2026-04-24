import { modelsIndex } from './meilisearch.js'; // ¡Importante el .js en ESM!

const transformModelForMeili = (model) => {
  return {
    id: model.id,
    title: model.title,
    description: model.description,
    author_username: model.author?.username || 'Anónimo',
    category_names: model.model_category?.map(mc => mc.categories.name) || [],
    tag_names: model.model_tag?.map(mt => mt.tags.name) || [],
    license: model.license,
    main_image_url: model.main_image_url,
    created_at: model.created_at ? new Date(model.created_at).getTime() : Date.now(),
    views: model.views || 0,
    downloads: model.downloads || 0
  };
};

export const syncModelToMeili = async (model) => {
  try {
    const document = transformModelForMeili(model);
    await modelsIndex.addDocuments([document]);
    console.log(`🔍 Modelo ${model.id} sincronizado con Meilisearch`);
  } catch (error) {
    console.error('❌ Error al sincronizar con Meilisearch:', error);
  }
};

export const deleteModelFromMeili = async (modelId) => {
  try {
    await modelsIndex.deleteDocument(modelId);
    console.log(`🗑️ Modelo ${modelId} eliminado de Meilisearch`);
  } catch (error) {
    console.error('❌ Error al eliminar de Meilisearch:', error);
  }
};