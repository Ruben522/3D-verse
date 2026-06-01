import prisma from "../config/prisma.js";
import { deleteModelFromMeili, syncModelToMeili } from "../server/meilisearchSync.js";
import { checkPermission } from "../utils/checkPermission.js";

const formatModelAuthor = (model) => {
  if (!model) return model;
  const { users, ...restOfModel } = model;

  return {
    ...restOfModel,
    author: {
      id: users?.id,
      username: users?.profile?.username || "Usuario Desconocido",
      avatar: users?.profile?.avatar || null
    }
  };
};

const createModel = async (userId, data) => {
  if (!data) throw new Error("Faltan los datos del modelo");

  const { title, main_color, description, file_url, main_image_url, video_url, license, parts, images, gallery, tags, categories } = data;

  if (!title || typeof title !== "string" || title.trim() === "") throw new Error("El título del modelo es obligatorio.");
  if (!file_url || typeof file_url !== "string" || file_url.trim() === "") throw new Error("La URL del archivo principal es obligatoria.");

  const galleryImages = images || gallery;

  const model = await prisma.models.create({
    data: {
      user_id: userId,
      title,
      main_color: main_color || null,
      description,
      file_url,
      main_image_url: main_image_url || null,
      video_url,
      license: license || "All Rights Reserved",
      model_parts: parts?.length ? {
        create: parts.map((p) => ({
          color: p.color || null,
          part_name: p.part_name,
          file_url: p.file_url,
          file_size: p.file_size,
        })),
      } : undefined,
      model_images: galleryImages?.length ? {
        create: galleryImages.map((img, index) => ({
          image_url: img,
          display_order: index,
        })),
      } : undefined,
      model_tag: tags?.length ? {
        create: tags.map((tagId) => ({
          tag_id: tagId,
        })),
      } : undefined,
      model_category: categories?.length ? {
        create: categories.map((catId) => ({
          category_id: catId,
        })),
      } : undefined,
    },
    include: getModelIncludes(),
  });

  await syncModelToMeili(model);
  return model;
};

const getModelById = async (modelId) => {
  const updatedModel = await prisma.models.update({
    where: { id: modelId },
    data: { views: { increment: 1 } },
    include: {
      users: {
        select: {
          id: true,
          profile: { select: { username: true, avatar: true } },
        },
      },
      model_parts: true,
      model_images: { orderBy: { display_order: "asc" } },
      model_tag: { include: { tags: true } },
      model_category: { include: { categories: true } },
      _count: { select: { model_likes: true } },
    },
  });

  if (!updatedModel) throw new Error("Modelo no encontrado");
  return formatModelAuthor(updatedModel);
};

const getModelIncludes = () => ({
  users: {
    select: {
      id: true,
      profile: { select: { username: true, avatar: true } },
    },
  },
  model_tag: { include: { tags: { select: { id: true, name: true } } } },
  model_category: { include: { categories: { select: { id: true, name: true } } } },
  _count: { select: { model_likes: true } },
});

const getModels = async ({ page = 1, limit = 20 }) => {
  const safeLimit = Math.min(limit, 50);
  const offset = (page - 1) * safeLimit;

  const [total, models] = await prisma.$transaction([
    prisma.models.count(),
    prisma.models.findMany({
      take: safeLimit,
      skip: offset,
      orderBy: { created_at: "desc" },
      include: getModelIncludes(),
    }),
  ]);

  return {
    page,
    limit: safeLimit,
    total,
    totalPages: Math.ceil(total / safeLimit),
    data: models.map(formatModelAuthor),
  };
};

const getModelsByUser = async (userId, { page = 1, limit = 20 }) => {
  const safeLimit = Math.min(limit, 50);
  const offset = (page - 1) * safeLimit;

  const [total, models] = await prisma.$transaction([
    prisma.models.count({ where: { user_id: userId } }),
    prisma.models.findMany({
      where: { user_id: userId },
      take: safeLimit,
      skip: offset,
      orderBy: { created_at: "desc" },
      include: getModelIncludes(),
    }),
  ]);

  return {
    page,
    limit: safeLimit,
    total,
    totalPages: Math.ceil(total / safeLimit),
    data: models.map(formatModelAuthor),
  };
};

const deleteModel = async (modelId, user) => {
  const model = await prisma.models.findUnique({ where: { id: modelId } });
  if (!model) throw new Error("Modelo no encontrado");

  checkPermission(model.user_id, user);

  await prisma.models.delete({ where: { id: modelId } });
  await deleteModelFromMeili(modelId);
  return { message: "Modelo y archivos eliminados correctamente de la base de datos" };
};

const updateModel = async (modelId, user, data) => {
  const model = await prisma.models.findUnique({ where: { id: modelId } });
  if (!model) throw new Error("Modelo no encontrado");

  checkPermission(model.user_id, user);

  const updateData = {
    title: data.title,
    description: data.description,
    main_color: data.main_color,
    license: data.license,
    video_url: data.video_url,
    updated_at: new Date(),
    model_category: data.categories ? {
      deleteMany: {},
      create: data.categories.map((catId) => ({ category_id: catId }))
    } : undefined,
  };

  if (data.tags && Array.isArray(data.tags)) {
    const tagIds = [];
    for (const tagName of data.tags) {
      const nameLower = tagName.toLowerCase().trim();
      if (!nameLower) continue;
      let tagRecord = await prisma.tags.findFirst({ where: { name: nameLower } });
      if (!tagRecord) tagRecord = await prisma.tags.create({ data: { name: nameLower } });
      tagIds.push(tagRecord.id);
    }
    updateData.model_tag = {
      deleteMany: {},
      create: tagIds.map((id) => ({ tag_id: id })),
    };
  }

  const updatedModel = await prisma.models.update({
    where: { id: modelId },
    data: updateData,
  });

  await syncModelToMeili(modelId);
  return updatedModel;
};

const addLike = async (modelId, userId) => {
  try {
    await prisma.model_likes.create({ data: { user_id: userId, model_id: modelId } });
  } catch (error) {
    if (error.code !== "P2002") throw error;
  }
  const likesCount = await prisma.model_likes.count({ where: { model_id: modelId } });
  await syncModelToMeili(modelId);
  return { likes: likesCount };
};

const removeLike = async (modelId, userId) => {
  try {
    await prisma.model_likes.delete({
      where: { user_id_model_id: { user_id: userId, model_id: modelId } },
    });
  } catch (error) {
    if (error.code !== "P2025") throw error;
  }
  const likesCount = await prisma.model_likes.count({ where: { model_id: modelId } });
  return { likes: likesCount };
};

const updateMainImage = async (modelId, user, imageUrl) => {
  const model = await prisma.models.findUnique({ where: { id: modelId } });
  if (!model) throw new Error("Modelo no encontrado");
  checkPermission(model.user_id, user);

  const updatedModel = await prisma.models.update({
    where: { id: modelId },
    data: { main_image_url: imageUrl },
  });

  return updatedModel;
};

const deleteMainImage = async (modelId, user) => {
  const model = await prisma.models.findUnique({ where: { id: modelId } });
  if (!model) throw new Error("Modelo no encontrado");
  checkPermission(model.user_id, user);
  if (!model.main_image_url) throw new Error("El modelo ya no tiene imagen principal");

  await prisma.models.update({
    where: { id: modelId },
    data: { main_image_url: null },
  });

  return { message: "Imagen principal desenlazada correctamente" };
};

const replaceMainFile = async (modelId, user, newFileUrl) => {
  const model = await prisma.models.findUnique({ where: { id: modelId } });
  if (!model) throw new Error("Modelo no encontrado");
  checkPermission(model.user_id, user);

  const updatedModel = await prisma.models.update({
    where: { id: modelId },
    data: { file_url: newFileUrl },
  });

  return updatedModel;
};

export {
  createModel, getModelById, getModels, getModelsByUser, deleteModel, updateModel, addLike, removeLike, updateMainImage, deleteMainImage, replaceMainFile,
};