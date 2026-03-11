import pool from "../config/db.js";
import { faker } from "@faker-js/faker";
import { hashPassword } from "../utils/hashPassword.js";

// AUMENTAMOS LA CANTIDAD DE DATOS
const NUM_USERS = 20;
const NUM_MODELS = 40;
const NUM_TAGS = 25;
const NUM_CATEGORIES = 10;

const seed = async () => {
    console.log("🌱 Iniciando el proceso de Seeding...");
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // 1. Limpiar la base de datos (orden correcto para respetar FK)
        console.log("🧹 Limpiando base de datos...");
        await client.query("DELETE FROM model_category");
        await client.query("DELETE FROM categories");
        await client.query("DELETE FROM model_likes");
        await client.query("DELETE FROM followers");
        await client.query("DELETE FROM model_tag");
        await client.query("DELETE FROM comments");
        await client.query("DELETE FROM favorites");
        await client.query("DELETE FROM downloads");
        await client.query("DELETE FROM model_images");
        await client.query("DELETE FROM model_parts");
        await client.query("DELETE FROM models");
        await client.query("DELETE FROM tags");
        await client.query("DELETE FROM profiles");
        await client.query("DELETE FROM users");

        // 2. Crear Categories
        console.log("📁 Creando Categorías...");
        const categoryIds = [];
        const categoriasPrincipales = [
            "Arte y Diseño",
            "Tecnología",
            "Educación",
            "Arquitectura",
            "Moda",
            "Juguetes",
            "Medicina",
            "Automoción",
            "Videojuegos",
            "Ciencia",
        ];

        for (let i = 0; i < NUM_CATEGORIES; i++) {
            const categoryName = categoriasPrincipales[i] || faker.commerce.department();
            const result = await client.query(
                "INSERT INTO categories (name, created_at) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING id",
                [categoryName, new Date()]
            );
            if (result.rows.length > 0) {
                categoryIds.push(result.rows[0].id);
            }
        }
        console.log(`✅ ${categoryIds.length} categorías creadas`);

        // 3. Crear tags
        console.log("🏷️ Creando Tags...");
        const tagIds = [];
        const categoriasBase = [
            "impresion-3d",
            "arte-digital",
            "personajes",
            "vehiculos",
            "arquitectura",
            "muebles",
            "joyeria",
            "herramientas",
            "juguetes",
            "figuras-accion",
            "naturaleza",
            "ciencia-ficcion",
            "fantasia",
            "tecnologia",
            "educativo",
            "deportes",
            "musica",
            "moda",
            "accesorios",
            "electronica",
            "robotica",
            "miniaturas",
            "dioramas",
            "cosplay",
            "decoracion",
        ];

        for (let i = 0; i < NUM_TAGS; i++) {
            const tagName = categoriasBase[i] || faker.helpers.slugify(faker.commerce.department()).toLowerCase();
            const result = await client.query(
                "INSERT INTO tags (name, created_at) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING id",
                [tagName.substring(0, 50), new Date()]
            );
            if (result.rows.length > 0) {
                tagIds.push(result.rows[0].id);
            }
        }
        console.log(`✅ ${tagIds.length} tags creados`);

        // 4. Crear Usuarios y sus perfiles
        console.log("👤 Creando Usuarios y Perfiles...");
        const userIds = [];

        // --- ADMIN PARA EL PROFESOR ---
        const adminPass = await hashPassword("admin123");
        const now = new Date();
        
        const adminResult = await client.query(
            `INSERT INTO users (email, password_hash, role, created_at, updated_at) 
             VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            ["admin@3dverse.com", adminPass, "admin", now, now]
        );
        const adminUserId = adminResult.rows[0].id;
        userIds.push(adminUserId);

        // Crear perfil del admin
        await client.query(
            `INSERT INTO profiles (
                user_id, username, name, lastname, avatar, bio, location, 
                youtube, twitter, linkedin, github, banner_url, card_bg_color, 
                page_bg_url, badge_url, primary_color, followers_count, following_count,
                created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)`,
            [
                adminUserId,
                "admin",
                "Profesor",
                "Admin",
                faker.image.avatar(),
                "Cuenta de evaluación del profesor",
                "España",
                "https://youtube.com/@profesor3d",
                "@profesor3d",
                "https://linkedin.com/in/profesor3d",
                "https://github.com/profesor3d",
                faker.image.urlPicsumPhotos({ width: 1200, height: 300 }), // banner_url
                faker.helpers.arrayElement(["#ffffff", "#f3f4f6", "#1f2937"]), // card_bg_color
                faker.image.urlPicsumPhotos({ width: 1920, height: 1080 }), // page_bg_url
                faker.image.urlPicsumPhotos({ width: 100, height: 100 }), // badge_url
                faker.helpers.arrayElement(["#3b82f6", "#ef4444", "#10b981", "#f59e0b"]), // primary_color
                0, // followers_count
                0,  // following_count
                now, // created_at
                now  // updated_at
            ]
        );

        // --- USUARIOS FALSOS ---
        const userPass = await hashPassword("user123");
        for (let i = 0; i < NUM_USERS; i++) {
            const firstName = faker.person.firstName();
            const lastName = faker.person.lastName();
            const email = faker.internet.email({ firstName, lastName });
            const username = faker.internet
                .username({ firstName, lastName })
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "")
                .substring(0, 50);
            
            const userNow = new Date();

            // Insertar usuario
            const userResult = await client.query(
                `INSERT INTO users (email, password_hash, role, created_at, updated_at) 
                 VALUES ($1, $2, $3, $4, $5) RETURNING id`,
                [email, userPass, 'user', userNow, userNow]
            );
            const userId = userResult.rows[0].id;
            userIds.push(userId);

            // Insertar perfil
            await client.query(
                `INSERT INTO profiles (
                    user_id, username, name, lastname, avatar, bio, location, 
                    youtube, twitter, linkedin, github, banner_url, card_bg_color, 
                    page_bg_url, badge_url, primary_color, followers_count, following_count,
                    created_at, updated_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)`,
                [
                    userId,
                    username,
                    firstName,
                    lastName,
                    faker.image.avatar(),
                    faker.lorem.paragraph({ min: 1, max: 3 }),
                    faker.location.city() + ", " + faker.location.country(),
                    faker.datatype.boolean(0.3) ? "https://youtube.com/@" + username : null,
                    faker.datatype.boolean(0.3) ? "@" + username : null,
                    faker.datatype.boolean(0.3) ? "https://linkedin.com/in/" + username : null,
                    faker.datatype.boolean(0.3) ? "https://github.com/" + username : null,
                    faker.datatype.boolean(0.5) ? faker.image.urlPicsumPhotos({ width: 1200, height: 300 }) : null,
                    faker.helpers.arrayElement(["#ffffff", "#f3f4f6", "#1f2937", "#374151", null]),
                    faker.datatype.boolean(0.3) ? faker.image.urlPicsumPhotos({ width: 1920, height: 1080 }) : null,
                    faker.datatype.boolean(0.4) ? faker.image.urlPicsumPhotos({ width: 100, height: 100 }) : null,
                    faker.helpers.arrayElement(["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", null]),
                    0, // followers_count
                    0,  // following_count
                    userNow, // created_at
                    userNow  // updated_at
                ]
            );
        }

        console.log(`✅ ${userIds.length} usuarios y sus perfiles creados`);

        // 5. Crear Modelos
        console.log("🧊 Creando Modelos y relaciones...");
        const modelIds = [];

        const licencias = [
            "All Rights Reserved",
            "Creative Commons",
            "MIT",
            "GPL",
            "Apache 2.0",
            "Mozilla Public License",
        ];
        const colores = [
            "#FF5733",
            "#33FF57",
            "#3357FF",
            "#F333FF",
            "#FF33F3",
            "#33FFF3",
            "#F3FF33",
            "#FF8333",
        ];

        for (let i = 0; i < NUM_MODELS; i++) {
            const randomUserId = faker.helpers.arrayElement(userIds);

            // Generar títulos más variados
            let title;
            if (i % 3 === 0) {
                title = `3D Modelo de ${faker.commerce.productName()}`;
            } else if (i % 3 === 1) {
                title = `${faker.commerce.productAdjective()} ${faker.commerce.product()}`;
            } else {
                title = `${faker.animal.type()} en 3D`;
            }

            const now = new Date();
            const modelResult = await client.query(
                `INSERT INTO models (user_id, title, main_color, description, file_url, main_image_url, video_url, license, downloads, views, created_at, updated_at) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id`,
                [
                    randomUserId,
                    title.substring(0, 255),
                    faker.helpers.arrayElement(colores),
                    faker.lorem.paragraphs({ min: 1, max: 3 }),
                    "/uploads/models/fake_model_" + faker.string.alphanumeric(10) + ".zip",
                    faker.image.urlPicsumPhotos({ width: 800, height: 600 }),
                    faker.datatype.boolean(0.3) ? "https://youtube.com/watch?v=" + faker.string.alphanumeric(11) : null,
                    faker.helpers.arrayElement(licencias),
                    faker.number.int({ min: 0, max: 5000 }),
                    faker.number.int({ min: 0, max: 15000 }),
                    now,
                    now
                ]
            );
            const modelId = modelResult.rows[0].id;
            modelIds.push(modelId);

            // Asignar categorías al modelo (entre 1 y 3 categorías)
            const numCategoriesForModel = faker.number.int({ min: 1, max: 3 });
            const shuffledCategories = faker.helpers.shuffle(categoryIds).slice(0, numCategoriesForModel);
            for (const categoryId of shuffledCategories) {
                await client.query(
                    "INSERT INTO model_category (model_id, category_id, created_at) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING",
                    [modelId, categoryId, new Date()]
                );
            }

            // Imágenes adicionales del modelo
            const numImages = faker.number.int({ min: 1, max: 4 });
            for (let j = 0; j < numImages; j++) {
                await client.query(
                    `INSERT INTO model_images (model_id, image_url, display_order, created_at) VALUES ($1, $2, $3, $4)`,
                    [modelId, faker.image.urlPicsumPhotos({ width: 800, height: 600 }), j, new Date()]
                );
            }

            // Partes del modelo
            const numParts = faker.number.int({ min: 1, max: 5 });
            for (let j = 0; j < numParts; j++) {
                await client.query(
                    `INSERT INTO model_parts (model_id, color, part_name, file_url, file_size, created_at) VALUES ($1, $2, $3, $4, $5, $6)`,
                    [
                        modelId,
                        faker.color.rgb(),
                        faker.commerce.productMaterial() + " " + faker.helpers.arrayElement(["Piece", "Part", "Component"]),
                        "/uploads/models/part_" + faker.string.alphanumeric(8) + ".stl",
                        faker.number.int({ min: 50000, max: 5000000 }),
                        new Date()
                    ]
                );
            }

            // Tags del modelo
            const numTagsForModel = faker.number.int({ min: 2, max: 6 });
            const shuffledTags = faker.helpers.shuffle(tagIds).slice(0, numTagsForModel);
            for (const tagId of shuffledTags) {
                await client.query(
                    "INSERT INTO model_tag (model_id, tag_id, created_at) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING",
                    [modelId, tagId, new Date()]
                );
            }
        }

        console.log(`✅ ${modelIds.length} modelos creados`);

        // 6. Crear relaciones adicionales
        console.log("💬 Creando relaciones adicionales...");

        // Comentarios
        for (const modelId of modelIds) {
            const numComments = faker.number.int({ min: 1, max: 4 });
            for (let i = 0; i < numComments; i++) {
                await client.query(
                    "INSERT INTO comments (user_id, model_id, content, created_at, updated_at) VALUES ($1, $2, $3, $4, $5)",
                    [
                        faker.helpers.arrayElement(userIds),
                        modelId,
                        faker.lorem.paragraph({ min: 1, max: 2 }),
                        faker.date.recent({ days: 60 }),
                        faker.date.recent({ days: 60 })
                    ]
                );
            }
        }

        // Likes
        for (const modelId of modelIds) {
            const numLikes = faker.number.int({ min: 0, max: 15 });
            const shuffledUsers = faker.helpers.shuffle(userIds).slice(0, numLikes);
            for (const userId of shuffledUsers) {
                await client.query(
                    "INSERT INTO model_likes (user_id, model_id, created_at) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING",
                    [userId, modelId, faker.date.recent({ days: 30 })]
                );
            }
        }

        // Favoritos
        for (const modelId of modelIds) {
            const numFavs = faker.number.int({ min: 0, max: 8 });
            const shuffledUsers = faker.helpers.shuffle(userIds).slice(0, numFavs);
            for (const userId of shuffledUsers) {
                await client.query(
                    "INSERT INTO favorites (user_id, model_id, created_at) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING",
                    [userId, modelId, faker.date.recent({ days: 45 })]
                );
            }
        }

        // Descargas
        for (const modelId of modelIds) {
            const numDownloads = faker.number.int({ min: 0, max: 20 });
            for (let i = 0; i < numDownloads; i++) {
                await client.query(
                    `INSERT INTO downloads (user_id, model_id, ip_address, user_agent, created_at) 
                     VALUES ($1, $2, $3, $4, $5)`,
                    [
                        faker.helpers.arrayElement([...userIds, null]),
                        modelId,
                        faker.internet.ip(),
                        faker.internet.userAgent(),
                        faker.date.recent({ days: 90 }),
                    ]
                );
            }
        }

        // Seguidores (relaciones entre usuarios)
        for (const userId of userIds) {
            const numFollowers = faker.number.int({ min: 0, max: 12 });
            const potentialFollowers = userIds.filter(id => id !== userId);
            const shuffledFollowers = faker.helpers.shuffle(potentialFollowers).slice(0, numFollowers);

            for (const followerId of shuffledFollowers) {
                await client.query(
                    "INSERT INTO followers (user_id, follower_id, followed_at) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING",
                    [userId, followerId, faker.date.past({ years: 0.5 })]
                );
            }
        }

        // Actualizar contadores de followers/following en profiles
        for (const userId of userIds) {
            // Contar followers (gente que sigue a este usuario)
            const followersRes = await client.query(
                "SELECT COUNT(*) FROM followers WHERE user_id = $1",
                [userId]
            );
            const followersCount = parseInt(followersRes.rows[0].count);

            // Contar following (a quién sigue este usuario)
            const followingRes = await client.query(
                "SELECT COUNT(*) FROM followers WHERE follower_id = $1",
                [userId]
            );
            const followingCount = parseInt(followingRes.rows[0].count);

            const now = new Date();
            await client.query(
                "UPDATE profiles SET followers_count = $1, following_count = $2, updated_at = $3 WHERE user_id = $4",
                [followersCount, followingCount, now, userId]
            );
        }

        await client.query("COMMIT");

        // Estadísticas finales
        console.log("\n" + "=".repeat(50));
        console.log("✅ ¡BASE DE DATOS POBLADA CON ÉXITO!");
        console.log("=".repeat(50));
        console.log("📊 ESTADÍSTICAS FINALES:");
        console.log(`👤 Usuarios: ${userIds.length}`);
        console.log(`📁 Categorías: ${categoryIds.length}`);
        console.log(`🏷️ Tags: ${tagIds.length}`);
        console.log(`🧊 Modelos 3D: ${modelIds.length}`);

        // Contar relaciones
        const commentsCount = (await client.query("SELECT COUNT(*) FROM comments")).rows[0].count;
        const likesCount = (await client.query("SELECT COUNT(*) FROM model_likes")).rows[0].count;
        const favsCount = (await client.query("SELECT COUNT(*) FROM favorites")).rows[0].count;
        const downloadsCount = (await client.query("SELECT COUNT(*) FROM downloads")).rows[0].count;
        const followersCount = (await client.query("SELECT COUNT(*) FROM followers")).rows[0].count;
        const modelCategoriesCount = (await client.query("SELECT COUNT(*) FROM model_category")).rows[0].count;

        console.log(`💬 Comentarios: ${commentsCount}`);
        console.log(`❤️ Likes: ${likesCount}`);
        console.log(`⭐ Favoritos: ${favsCount}`);
        console.log(`📥 Descargas: ${downloadsCount}`);
        console.log(`🤝 Relaciones de seguidores: ${followersCount}`);
        console.log(`📑 Asignaciones de categorías: ${modelCategoriesCount}`);
        console.log("=".repeat(50));
        console.log("🔑 CREDENCIALES DE ACCESO:");
        console.log("Email Admin: admin@3dverse.com");
        console.log("Password Admin: admin123");
        console.log("Password genérica de usuarios: user123");
        console.log("=".repeat(50));
        
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("❌ Error durante el seeding:", error);
    } finally {
        client.release();
        process.exit();
    }
};

seed();