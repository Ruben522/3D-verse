import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function runSeed() {
  console.log('🌱 Iniciando la creación de Usuarios, Modelos y Likes falsos...');

  try {
    const NUM_USERS = 15;
    const NUM_MODELS = 50;

    // ==========================================
    // 1. CREACIÓN DE USUARIOS FALSOS
    // ==========================================
    console.log(`👤 Generando ${NUM_USERS} usuarios con avatares...`);
    const createdUsers = [];

    // ¡Aquí estaba el bucle desaparecido!
    for (let i = 0; i < NUM_USERS; i++) {
      let fakeUser = await prisma.users.create({
        data: {
          email: faker.internet.email(),
          role: 'user',
          password_hash: 'fake_password_hash_123',
          profile: {
            create: {
              username: faker.internet.username().toLowerCase() + faker.number.int({ max: 99 }),
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
      
      createdUsers.push(fakeUser); // Guardamos el usuario en la lista
    }

    // ==========================================
    // 2. CREACIÓN DE MODELOS ASIGNADOS
    // ==========================================
    console.log(`📦 Creando ${NUM_MODELS} modelos y asignándoselos a los usuarios...`);
    const createdModels = [];

    const categorias = ['Robot', 'Coche', 'Casa', 'Espada', 'Nave Espacial', 'Personaje', 'Mueble', 'Arma'];

    for (let i = 0; i < NUM_MODELS; i++) {
      const randomAuthor = createdUsers[faker.number.int({ min: 0, max: NUM_USERS - 1 })];
      const randomCategory = categorias[faker.number.int({ min: 0, max: categorias.length - 1 })];

      const fakeModel = await prisma.models.create({
        data: {
          title: `${faker.commerce.productAdjective()} ${randomCategory} 3D`,
          description: faker.lorem.paragraphs(2),
          // Usamos la nueva función recomendada por Faker
          main_image_url: faker.image.url(), 
          file_url: 'dummy-file.glb',
          license: 'Standard',
          views: faker.number.int({ min: 10, max: 5000 }),
          downloads: faker.number.int({ min: 0, max: 1000 }),
          users: {
            connect: { id: randomAuthor.id }
          }
        }
      });
      createdModels.push(fakeModel);
    }

    // ==========================================
    // 3. REPARTO DE LIKES (Interacciones)
    // ==========================================
    console.log(`❤️ Simulando que los usuarios le dan Like a los modelos...`);
    
    for (const model of createdModels) {
      const shuffledUsers = [...createdUsers].sort(() => 0.5 - Math.random());
      const numLikes = faker.number.int({ min: 0, max: NUM_USERS });
      const likers = shuffledUsers.slice(0, numLikes);

      for (const liker of likers) {
        await prisma.model_likes.create({
          data: {
            users: { connect: { id: liker.id } },
            models: { connect: { id: model.id } }
          }
        });
      }
    }

    console.log(`✅ ¡Magia completada! Tu base de datos parece la de una plataforma en pleno rendimiento.`);
    console.log(`⚠️ Paso final: Ejecuta 'node sync-initial.js' para purgar Meilisearch y subir todo este contenido nuevo.`);

  } catch (error) {
    console.error('❌ Error inyectando datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

runSeed();