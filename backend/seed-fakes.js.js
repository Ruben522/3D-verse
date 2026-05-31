import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function runSeed() {
  console.log('🌱 Iniciando la SUPER plantación de datos falsos...');

  try {
    const NUM_USERS = 15;
    const NUM_MODELS = 50;
    const NUM_TAGS = 15;

    // ==========================================
    // 0. LIMPIEZA PREVIA (Opcional pero recomendado)
    // ==========================================
    console.log('🧹 Limpiando datos antiguos...');
    await prisma.comments.deleteMany();
    await prisma.model_likes.deleteMany();
    await prisma.model_category.deleteMany();
    await prisma.model_tag.deleteMany();
    await prisma.models.deleteMany();
    await prisma.categories.deleteMany();
    await prisma.tags.deleteMany();
    await prisma.users.deleteMany(); // Esto también borrará perfiles por el Cascade

    // ==========================================
    // 1. CREACIÓN DE CATEGORÍAS Y TAGS
    // ==========================================
    console.log(`🏷️ Generando Categorías y Tags...`);
    const categoriasBase = ['Vehículos', 'Personajes', 'Arquitectura', 'Armas', 'Mobiliario', 'Sci-Fi', 'Fantasía', 'Naturaleza'];
    const createdCategories = [];

    for (const catName of categoriasBase) {
      const cat = await prisma.categories.create({ data: { name: catName } });
      createdCategories.push(cat);
    }

    const createdTags = [];
    for (let i = 0; i < NUM_TAGS; i++) {
      // Usamos palabras aleatorias para los tags y nos aseguramos de que sean únicos
      const tag = await prisma.tags.create({
        data: { name: faker.word.adjective() + i } // + i para evitar duplicados
      });
      createdTags.push(tag);
    }

    // ==========================================
    // 2. CREACIÓN DE USUARIOS FALSOS
    // ==========================================
    console.log(`👤 Generando ${NUM_USERS} usuarios con avatares...`);
    const createdUsers = [];

    for (let i = 0; i < NUM_USERS; i++) {
      let fakeUser = await prisma.users.create({
        data: {
          email: faker.internet.email(),
          role: 'user',
          password_hash: 'fake_password_hash_123',
          profile: {
            create: {
              username: faker.internet.userName().toLowerCase() + faker.number.int({ max: 999 }),
              name: faker.person.firstName(),
              lastname: faker.person.lastName(),
              avatar: faker.image.avatar(),
              bio: faker.person.bio(),
              primary_color: faker.color.rgb(),
              card_bg_color: '#ffffff',
              followers_count: faker.number.int({ min: 0, max: 100 }),
              following_count: faker.number.int({ min: 0, max: 50 })
            }
          }
        },
        include: {
          profile: true
        }
      });
      createdUsers.push(fakeUser);
    }

    // ==========================================
    // 3. CREACIÓN DE MODELOS (Con Categorías y Tags)
    // ==========================================
    console.log(`📦 Creando ${NUM_MODELS} modelos 3D hiperrealistas...`);
    const createdModels = [];

    for (let i = 0; i < NUM_MODELS; i++) {
      const randomAuthor = createdUsers[faker.number.int({ min: 0, max: NUM_USERS - 1 })];

      // Seleccionamos entre 1 y 2 categorías al azar
      const shuffledCategories = [...createdCategories].sort(() => 0.5 - Math.random());
      const selectedCategories = shuffledCategories.slice(0, faker.number.int({ min: 1, max: 2 }));

      // Seleccionamos entre 2 y 4 tags al azar
      const shuffledTags = [...createdTags].sort(() => 0.5 - Math.random());
      const selectedTags = shuffledTags.slice(0, faker.number.int({ min: 2, max: 4 }));

      const fakeModel = await prisma.models.create({
        data: {
          title: `${faker.commerce.productAdjective()} ${faker.commerce.productMaterial()} 3D Model`,
          description: faker.lorem.paragraphs(2),
          main_image_url: faker.image.url(),
          file_url: 'https://ejemplo.com/archivo-dummy.zip', // Requerido por tu esquema
          license: 'Standard',
          views: faker.number.int({ min: 10, max: 5000 }),
          downloads: faker.number.int({ min: 0, max: 1000 }),
          users: {
            connect: { id: randomAuthor.id }
          },
          // Conectamos las categorías mediante la tabla intermedia 'model_category'
          model_category: {
            create: selectedCategories.map(cat => ({
              category_id: cat.id
            }))
          },
          // Conectamos los tags mediante la tabla intermedia 'model_tag'
          model_tag: {
            create: selectedTags.map(tag => ({
              tag_id: tag.id
            }))
          }
        }
      });
      createdModels.push(fakeModel);
    }

    // ==========================================
    // 4. REPARTO DE LIKES Y COMENTARIOS
    // ==========================================
    console.log(`❤️ Simulando Likes y 💬 Comentarios...`);

    for (const model of createdModels) {
      const shuffledUsers = [...createdUsers].sort(() => 0.5 - Math.random());

      // LIKES (entre 0 y 5 likes por modelo)
      const numLikes = faker.number.int({ min: 0, max: 5 });
      const likers = shuffledUsers.slice(0, numLikes);

      for (const liker of likers) {
        await prisma.model_likes.create({
          data: {
            users: { connect: { id: liker.id } },
            models: { connect: { id: model.id } }
          }
        });
      }

      // COMENTARIOS (entre 0 y 3 comentarios por modelo)
      const numComments = faker.number.int({ min: 0, max: 3 });
      const commenters = shuffledUsers.slice(0, numComments);

      for (const commenter of commenters) {
        await prisma.comments.create({
          data: {
            content: faker.lorem.sentences(faker.number.int({ min: 1, max: 2 })),
            users: { connect: { id: commenter.id } },
            models: { connect: { id: model.id } }
          }
        });
      }
    }

    console.log(`✅ ¡ÉXITO! Base de datos poblada masivamente.`);
    console.log(`⚠️ Ahora, asegúrate de ejecutar tu script de sincronización con MeiliSearch para indexarlo todo.`);

  } catch (error) {
    console.error('❌ Error inyectando datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

runSeed();