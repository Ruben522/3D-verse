import { PrismaClient } from '@prisma/client';
import { setupMeilisearch, modelsIndex, usersIndex } from './src/server/meilisearch.js';
import { syncModelToMeili, syncUserToMeili } from './src/server/meilisearchSync.js';

const prisma = new PrismaClient();

async function run() {
  console.log('🚀 Iniciando sincronización masiva con Meilisearch...');

  await setupMeilisearch();

  console.log('\n--- 🧊 SINCRONIZANDO MODELOS ---');
  console.log('🧹 Limpiando el índice de modelos de posibles IDs fantasma...');
  await modelsIndex.deleteAllDocuments();

  const allModels = await prisma.models.findMany({
    include: {
      users: {
        include: { profile: true }
      },
      model_category: {
        include: { categories: true }
      },
      model_tag: {
        include: { tags: true }
      },
      _count: {
        select: { model_likes: true }
      }
    }
  });

  console.log(`📦 Se han encontrado ${allModels.length} modelos. Subiendo...`);
  for (const model of allModels) {
    await syncModelToMeili(model);
  }

  console.log('\n--- 👥 SINCRONIZANDO USUARIOS ---');
  console.log('🧹 Limpiando el índice de usuarios...');
  await usersIndex.deleteAllDocuments();

  const allUsers = await prisma.users.findMany({
    include: {
      profile: true,
      _count: {
        select: { models: true }
      }
    }
  });

  console.log(`📦 Se han encontrado ${allUsers.length} creadores. Subiendo...`);
  for (const user of allUsers) {
    await syncUserToMeili(user);
  }

  console.log('\n✅ ¡Sincronización TOTAL completada con éxito!');

  await prisma.$disconnect();
  process.exit(0);
}

run();