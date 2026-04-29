import { modelsIndex, usersIndex } from './meilisearch.js';

// meilisearchSync.js corregido y robusto
const transformModelForMeili = (model) => {
    const tagNames = model.model_tag?.map(mt => {
    return mt.tags?.name || mt.tag?.name; 
  }).filter(Boolean) || [];
  return {
    id: model.id,
    title: model.title,
    description: model.description,
    author_username: model.author?.username || model.users?.profile?.username || 'Anónimo',
    author_avatar: model.author?.avatar || model.users?.profile?.avatar || null,
        category_names: model.model_category?.map(mc => 
      mc.categories?.name || mc.category?.name
    ).filter(Boolean) || [],
        tag_names: model.model_tag?.map(mt => 
      mt.tags?.name || mt.tag?.name
    ).filter(Boolean) || [],

    license: model.license,
    main_image_url: model.main_image_url,
    created_at: model.created_at ? new Date(model.created_at).getTime() : Date.now(),
    views: model.views || 0,
    downloads: model.downloads || 0,
    likes_count: model._count?.model_likes || 0
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

const transformUserForMeili = (user) => {
  const p = user.profile || user; 

  return {
    id: user.id,
    username: p.username || "Usuario Desconocido",
    avatar: p.avatar || null,
    bio: p.bio || "",
    models_count: user._count?.models || user.models_count || 0,
    followers_count: p.followers_count || 0,
    primary_color: p.primary_color || "#3b82f6",
    card_bg_color: p.card_bg_color || "#ffffff"
  };
};

export const syncUserToMeili = async (user) => {
  try {
    const document = transformUserForMeili(user);
    await usersIndex.addDocuments([document]);
    console.log(`👤 Usuario ${document.username} sincronizado`);
  } catch (error) {
    console.error('❌ Error sincronizando usuario con Meili:', error);
  }
};