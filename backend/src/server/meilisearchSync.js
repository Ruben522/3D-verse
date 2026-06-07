import { modelsIndex, usersIndex } from './meilisearch.js';
import prisma from "../config/prisma.js";

const transformModelForMeili = (model) => {
  const tags = model.model_tag?.map(mt => mt.tags?.name || mt.tag?.name).filter(Boolean) || [];
  const categories = model.model_category?.map(mc => mc.categories?.name || mc.category?.name).filter(Boolean) || [];

  return {
    id: model.id,
    title: model.title,
    description: model.description,
    author_username: model.author?.username || model.users?.profile?.username || 'Anónimo',
    author_avatar: model.author?.avatar || model.users?.profile?.avatar || null,
    category_names: categories,
    tag_names: tags,
    license: model.license,
    main_image_url: model.main_image_url,
    created_at: model.created_at ? new Date(model.created_at).getTime() : Date.now(),
    views: model.views || 0,
    downloads: model.downloads || 0,
    likes_count: model._count?.model_likes || model._count?.favorites || 0
  };
};

export const syncModelToMeili = async (modelOrId) => {
  try {
    const modelId = typeof modelOrId === 'object' ? modelOrId.id : modelOrId;

    const fullModel = await prisma.models.findUnique({
      where: { id: modelId },
      include: {
        users: { select: { profile: true } },
        model_tag: { include: { tags: true } },
        model_category: { include: { categories: true } },
        _count: { select: { model_likes: true } }
      }
    });

    if (!fullModel) {
      console.warn(`⚠️ Modelo ${modelId} no encontrado para sincronizar.`);
      return;
    }

    const document = transformModelForMeili(fullModel);
    await modelsIndex.addDocuments([document]);
  } catch (error) {
    console.error('Error al sincronizar modelo con Meilisearch:', error);
  }
};

export const syncUserToMeili = async (userOrId) => {
  try {
    const userId = typeof userOrId === 'object' ? userOrId.id : userOrId;

    const fullUser = await prisma.users.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        _count: {
          select: { models: true }
        }
      }
    });

    if (!fullUser) {
      console.warn(`⚠️ Usuario ${userId} no encontrado para sincronizar.`);
      return;
    }

    const document = transformUserForMeili(fullUser);
    await usersIndex.addDocuments([document]);
  } catch (error) {
    console.error('Error sincronizando usuario con Meili:', error);
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
    banner_url: p.banner_url || "",
    badge_url: p.badge_url || null,
    primary_color: p.primary_color || "#3b82f6",
    card_bg_color: p.card_bg_color || "#ffffff"
  };
};

export const deleteModelFromMeili = async (modelOrId) => {
  try {
    const modelId = typeof modelOrId === 'object' ? modelOrId.id : modelOrId;

    await modelsIndex.deleteDocument(modelId);
  } catch (error) {
    console.error('Error al eliminar de Meilisearch:', error);
  }
};