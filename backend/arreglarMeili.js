import { Meilisearch } from 'meilisearch';

const client = new Meilisearch({
  host: 'http://localhost:7700',
  apiKey: 'MiClaveSecreta123!',
});

async function arreglarReglas() {
  console.log('⏳ Enviando reglas al índice de usuarios...');

  try {
    const usersIndex = client.index('users');

    await usersIndex.updateSearchableAttributes([
      'username',
      'bio'
    ]);

    await usersIndex.updateSortableAttributes([
      'followers_count',
      'models_count'
    ]);

    console.log('✅ ¡Reglas aplicadas! Meilisearch ya sabe cómo ordenar.');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

arreglarReglas();