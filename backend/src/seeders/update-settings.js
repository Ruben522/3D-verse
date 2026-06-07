import { client } from '../server/meilisearch.js';

async function updateMeiliSettings() {
  try {
    const modelsIndex = client.index('models');

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

    const usersIndex = client.index('users');

    await usersIndex.updateSearchableAttributes([
      'username',
      'bio'
    ]);

    await usersIndex.updateSortableAttributes([
      'followers_count',
      'models_count'
    ]);

  } catch (error) {
    console.error('Error actualizando Meilisearch:', error);
  } finally {
    process.exit(0);
  }
}

updateMeiliSettings();