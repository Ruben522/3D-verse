import { PrismaClient } from '@prisma/client';
// 🔥 Añadimos usersIndex a la importación
import { setupMeilisearch, modelsIndex, usersIndex } from './src/server/meilisearch.js';
// 🔥 Añadimos syncUserToMeili
import { syncModelToMeili, syncUserToMeili } from './src/server/meilisearchSync.js';

const prisma = new PrismaClient();

async function run() {
  console.log('🚀 Iniciando sincronización masiva con Meilisearch...');
  
  // 1. Configuramos los filtros y reglas de búsqueda para AMBOS índices
  await setupMeilisearch();

  // ==========================================
  // 🧊 SINCRONIZACIÓN DE MODELOS
  // ==========================================
  console.log('\n--- 🧊 SINCRONIZANDO MODELOS ---');
  console.log('🧹 Limpiando el índice de modelos de posibles IDs fantasma...');
  await modelsIndex.deleteAllDocuments();

  const allModels = await prisma.models.findMany({
    include: {
      users: { 
        include: { profile: true } // 🔥 Necesario para que el modelo sepa el nombre del creador
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

  // ==========================================
  // 👥 SINCRONIZACIÓN DE CREADORES
  // ==========================================
  console.log('\n--- 👥 SINCRONIZANDO USUARIOS ---');
  console.log('🧹 Limpiando el índice de usuarios...');
  await usersIndex.deleteAllDocuments();

  // Traemos los usuarios con su perfil y el conteo de modelos
  const allUsers = await prisma.users.findMany({
    include: {
      profile: true, // Para el username, avatar, bio, followers_count, etc.
      _count: { 
        select: { models: true } // Para saber cuántos modelos ha subido
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