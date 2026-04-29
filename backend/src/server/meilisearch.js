import { Meilisearch } from 'meilisearch';

export const client = new Meilisearch({
  host: 'http://localhost:7700',
  apiKey: 'MiClaveSecreta123!', 
});

export const modelsIndex = client.index('models');

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
      'tag_names',
      'license',
      'author_username'
    ]);

    await modelsIndex.updateSortableAttributes([
      'created_at',
      'likes_count',
      'downloads'
    ]);

    console.log('✅ Meilisearch: Configuración de filtros y ordenación actualizada');
  } catch (error) {
    console.error('❌ Error configurando Meilisearch:', error);
  }
};

export const usersIndex = client.index('users');

const transformUserForMeili = (user) => {
  return {
    id: user.id,
    models_count: user.models_count || 0,
    username: user.username || "Desconocido",
    avatar: user.avatar || null,
    bio: user.bio || "",
    followers_count: user.followers_count || 0,
    banner_url: user.banner_url || null,
    card_bg_color: user.card_bg_color || "#ffffff",
    badge_url: user.badge_url || null,
    primary_color: user.primary_color || "#3b82f6"
  };
};

export const syncUserToMeili = async (user) => {
  try {
    const document = transformUserForMeili(user);
    await usersIndex.addDocuments([document]);
    console.log(`👤 Creador ${user.username} sincronizado con Meilisearch`);
  } catch (error) {
    console.error('❌ Error al sincronizar usuario con Meilisearch:', error);
  }
};