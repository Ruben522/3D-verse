import { Meilisearch } from 'meilisearch';

const client = new Meilisearch({
  host: 'http://localhost:7700',
  apiKey: 'MiClaveSecreta123!', 
});

async function arreglarReglas() {
  console.log('⏳ Enviando reglas al índice de usuarios...');
  
  try {
    const usersIndex = client.index('users');

    // 1. Decimos qué campos se pueden buscar escribiendo en la barra
    await usersIndex.updateSearchableAttributes([
      'username',
      'bio'
    ]);

    // 2. 🔥 ESTO ES LO QUE TE FALTA: Permiso para ordenar
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