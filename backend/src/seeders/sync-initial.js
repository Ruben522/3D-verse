import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import { setupMeilisearch, modelsIndex, usersIndex } from '../server/meilisearch.js';
import { syncModelToMeili, syncUserToMeili } from '../server/meilisearchSync.js';

const prisma = new PrismaClient();

async function run() {

  await setupMeilisearch();

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

  for (const model of allModels) {
    await syncModelToMeili(model);
  }

  await usersIndex.deleteAllDocuments();

  const allUsers = await prisma.users.findMany({
    include: {
      profile: true,
      _count: {
        select: { models: true }
      }
    }
  });

  for (const user of allUsers) {
    await syncUserToMeili(user);
  }

  await prisma.$disconnect();
  process.exit(0);
}

run();