import pool from "../config/db.js";
import { faker } from "@faker-js/faker";
import { hashPassword } from "../utils/hashPassword.js";

// AUMENTAMOS LA CANTIDAD DE DATOS
const NUM_USERS = 20; // Aumentado de 10 a 20
const NUM_MODELS = 40; // Aumentado de 20 a 40
const NUM_TAGS = 25; // Aumentado de 10 a 25
const NUM_COMMENTS_EXTRA = 30; // Comentarios adicionales aleatorios
const NUM_DOWNLOADS_EXTRA = 50; // Descargas adicionales aleatorias

const seed = async () => {
    console.log("🌱 Iniciando el proceso de Seeding...");
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // 1. Limpiar la base de datos (CASCADE se encarga de borrar las dependencias)
        console.log("🧹 Limpiando base de datos...");
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
        await client.query("DELETE FROM users");

        // Resetear secuencias si estás usando serial/autoincrement
        // await client.query("ALTER SEQUENCE users_id_seq RESTART WITH 1");

        // 2. Crear tags (más variados)
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
            "iluminacion",
            "jardineria",
            "cocina",
            "oficina",
            "escolar",
            "medicina",
            "automocion",
            "aeroespacial",
            "militar",
            "historia",
            "animales",
            "plantas",
            "alimentos",
            "bebidas",
            "instrumentos",
        ];

        // Usar las primeras NUM_TAGS categorías
        for (let i = 0; i < NUM_TAGS; i++) {
            const tagName =
                categoriasBase[i] ||
                faker.helpers
                    .slugify(faker.commerce.department())
                    .toLowerCase();
            const result = await client.query(
                "INSERT INTO tags (name) VALUES ($1) ON CONFLICT DO NOTHING RETURNING id",
                [tagName.substring(0, 50)],
            );
            if (result.rows.length > 0) {
                tagIds.push(result.rows[0].id);
            }
        }

        // Añadir algunos tags aleatorios extra
        for (let i = 0; i < 5; i++) {
            const randomTag = faker.helpers
                .slugify(faker.commerce.productAdjective())
                .toLowerCase();
            const result = await client.query(
                "INSERT INTO tags (name) VALUES ($1) ON CONFLICT DO NOTHING RETURNING id",
                [randomTag.substring(0, 50)],
            );
            if (result.rows.length > 0) {
                tagIds.push(result.rows[0].id);
            }
        }

        console.log(`✅ ${tagIds.length} tags creados`);

        // 3. Crear Usuarios
        console.log("👤 Creando Usuarios...");
        const userIds = [];

        // --- ADMIN PARA EL PROFESOR ---
        const adminPass = await hashPassword("admin123");
        const adminResult = await client.query(
            `INSERT INTO users (name, lastname, username, email, role, password_hash, avatar, bio, location, youtube, twitter, linkedin, github) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id`,
            [
                "Profesor",
                "Admin",
                "admin",
                "admin@3dverse.com",
                "admin",
                adminPass,
                faker.image.avatar(), // Añadimos avatar al admin
                "Cuenta de evaluación del profesor",
                "España",
                "https://youtube.com/@profesor3d",
                "@profesor3d",
                "https://linkedin.com/in/profesor3d",
                "https://github.com/profesor3d",
            ],
        );
        userIds.push(adminResult.rows[0].id);

        // --- USUARIOS FALSOS (AHORA 20) ---
        const userPass = await hashPassword("user123");
        for (let i = 0; i < NUM_USERS; i++) {
            const firstName = faker.person.firstName();
            const lastName = faker.person.lastName();
            const username = faker.internet
                .username({ firstName, lastName })
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "");

            const result = await client.query(
                `INSERT INTO users (name, lastname, username, email, role, password_hash, avatar, bio, location, youtube, twitter, linkedin, github) 
                 VALUES ($1, $2, $3, $4, 'user', $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id`,
                [
                    firstName,
                    lastName,
                    username,
                    faker.internet.email({
                        firstName,
                        lastName,
                    }),
                    userPass,
                    faker.image.avatar(),
                    faker.lorem.paragraph({
                        min: 1,
                        max: 3,
                    }),
                    faker.location.city() +
                        ", " +
                        faker.location.country(),
                    faker.datatype.boolean()
                        ? "https://youtube.com/@" + username
                        : null,
                    faker.datatype.boolean()
                        ? "@" + username
                        : null,
                    faker.datatype.boolean()
                        ? "https://linkedin.com/in/" +
                          username
                        : null,
                    faker.datatype.boolean()
                        ? "https://github.com/" + username
                        : null,
                ],
            );
            userIds.push(result.rows[0].id);
        }

        console.log(
            `✅ ${userIds.length} usuarios creados`,
        );

        // 4. Crear Modelos (AHORA 40)
        console.log("🧊 Creando Modelos y relaciones...");
        const modelIds = [];

        // Arrays para datos más variados
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
        const prefijosModelo = [
            "3D Modelo de",
            "Diseño de",
            "Render de",
            "Prototipo de",
            "Escultura de",
        ];
        const sufijosModelo = [
            "versión 1.0",
            "edición especial",
            "remasterizado",
            "optimizado",
            "para impresión 3D",
        ];

        for (let i = 0; i < NUM_MODELS; i++) {
            const randomUserId =
                faker.helpers.arrayElement(userIds);

            // Generar títulos más variados
            let title;
            if (i % 3 === 0) {
                title = `${faker.helpers.arrayElement(prefijosModelo)} ${faker.commerce.productName()}`;
            } else if (i % 3 === 1) {
                title = `${faker.commerce.productAdjective()} ${faker.commerce.product()}`;
            } else {
                title = `${faker.animal.type()} en 3D`;
            }

            // Añadir sufijo aleatorio
            if (faker.datatype.boolean(0.3)) {
                title += ` - ${faker.helpers.arrayElement(sufijosModelo)}`;
            }

            const modelResult = await client.query(
                `INSERT INTO models (user_id, title, main_color, description, file_url, main_image_url, video_url, license, downloads, views, created_at) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`,
                [
                    randomUserId,
                    title.substring(0, 255),
                    faker.helpers.arrayElement(colores),
                    faker.lorem.paragraphs({
                        min: 1,
                        max: 3,
                    }),
                    "/uploads/models/fake_model_" +
                        faker.string.alphanumeric(10) +
                        ".zip",
                    faker.image.urlPicsumPhotos({
                        width: 800,
                        height: 600,
                    }),
                    faker.datatype.boolean(0.3)
                        ? "https://youtube.com/watch?v=" +
                          faker.string.alphanumeric(11)
                        : null,
                    faker.helpers.arrayElement(licencias),
                    faker.number.int({ min: 0, max: 5000 }),
                    faker.number.int({
                        min: 0,
                        max: 15000,
                    }),
                    faker.date.past({ years: 1 }),
                ],
            );
            const modelId = modelResult.rows[0].id;
            modelIds.push(modelId);

            // Imágenes adicionales del modelo (entre 1 y 4)
            const numImages = faker.number.int({
                min: 1,
                max: 4,
            });
            for (let j = 0; j < numImages; j++) {
                await client.query(
                    `INSERT INTO model_images (model_id, image_url, display_order) VALUES ($1, $2, $3)`,
                    [
                        modelId,
                        faker.image.urlPicsumPhotos({
                            width: 800,
                            height: 600,
                        }),
                        j,
                    ],
                );
            }

            // Partes del modelo (entre 1 y 5 partes)
            const numParts = faker.number.int({
                min: 1,
                max: 5,
            });
            for (let j = 0; j < numParts; j++) {
                await client.query(
                    `INSERT INTO model_parts (model_id, color, part_name, file_url, file_size) VALUES ($1, $2, $3, $4, $5)`,
                    [
                        modelId,
                        faker.color.rgb(),
                        faker.commerce.productMaterial() +
                            " " +
                            faker.helpers.arrayElement([
                                "Piece",
                                "Part",
                                "Component",
                            ]),
                        "/uploads/models/part_" +
                            faker.string.alphanumeric(8) +
                            ".stl",
                        faker.number.int({
                            min: 50000,
                            max: 5000000,
                        }), // 50KB a 5MB
                    ],
                );
            }

            // Tags del modelo (entre 2 y 6 tags)
            const numTagsForModel = faker.number.int({
                min: 2,
                max: 6,
            });
            const shuffledTags = faker.helpers
                .shuffle(tagIds)
                .slice(0, numTagsForModel);
            for (const tagId of shuffledTags) {
                await client.query(
                    "INSERT INTO model_tag (model_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
                    [modelId, tagId],
                );
            }
        }

        console.log(
            `✅ ${modelIds.length} modelos creados`,
        );

        // 5. Crear relaciones adicionales (comentarios, likes, favoritos)
        console.log("💬 Creando relaciones adicionales...");

        // Comentarios (asegurar que cada modelo tenga al menos 1-2 comentarios + extras)
        for (const modelId of modelIds) {
            const numComments = faker.number.int({
                min: 1,
                max: 4,
            });
            for (let i = 0; i < numComments; i++) {
                await client.query(
                    "INSERT INTO comments (user_id, model_id, content, created_at) VALUES ($1, $2, $3, $4)",
                    [
                        faker.helpers.arrayElement(userIds),
                        modelId,
                        faker.lorem.paragraph({
                            min: 1,
                            max: 2,
                        }),
                        faker.date.recent({ days: 60 }),
                    ],
                );
            }
        }

        // Likes (cada modelo tiene entre 0 y 15 likes)
        for (const modelId of modelIds) {
            const numLikes = faker.number.int({
                min: 0,
                max: 15,
            });
            const shuffledUsers = faker.helpers
                .shuffle(userIds)
                .slice(0, numLikes);
            for (const userId of shuffledUsers) {
                await client.query(
                    "INSERT INTO model_likes (user_id, model_id, created_at) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING",
                    [
                        userId,
                        modelId,
                        faker.date.recent({ days: 30 }),
                    ],
                );
            }
        }

        // Favoritos (cada modelo tiene entre 0 y 8 favoritos)
        for (const modelId of modelIds) {
            const numFavs = faker.number.int({
                min: 0,
                max: 8,
            });
            const shuffledUsers = faker.helpers
                .shuffle(userIds)
                .slice(0, numFavs);
            for (const userId of shuffledUsers) {
                await client.query(
                    "INSERT INTO favorites (user_id, model_id, created_at) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING",
                    [
                        userId,
                        modelId,
                        faker.date.recent({ days: 45 }),
                    ],
                );
            }
        }

        // Descargas
        for (const modelId of modelIds) {
            const numDownloads = faker.number.int({
                min: 0,
                max: 20,
            });
            for (let i = 0; i < numDownloads; i++) {
                await client.query(
                    `INSERT INTO downloads (user_id, model_id, ip_address, user_agent, created_at) 
                     VALUES ($1, $2, $3, $4, $5)`,
                    [
                        faker.helpers.arrayElement([
                            ...userIds,
                            null,
                        ]),
                        modelId,
                        faker.internet.ip(),
                        faker.internet.userAgent(),
                        faker.date.recent({ days: 90 }),
                    ],
                );
            }
        }

        // Seguidores (relaciones entre usuarios)
        for (const userId of userIds) {
            const numFollowers = faker.number.int({
                min: 0,
                max: 12,
            });
            const potentialFollowers = userIds.filter(
                (id) => id !== userId,
            );
            const shuffledFollowers = faker.helpers
                .shuffle(potentialFollowers)
                .slice(0, numFollowers);

            for (const followerId of shuffledFollowers) {
                await client.query(
                    "INSERT INTO followers (user_id, follower_id, followed_at) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING",
                    [
                        userId,
                        followerId,
                        faker.date.past({ years: 0.5 }),
                    ],
                );
            }
        }

        // Actualizar contadores de followers/following
        for (const userId of userIds) {
            // Contar followers (gente que sigue a este usuario)
            const followersRes = await client.query(
                "SELECT COUNT(*) FROM followers WHERE user_id = $1",
                [userId],
            );
            const followersCount = parseInt(
                followersRes.rows[0].count,
            );

            // Contar following (a quién sigue este usuario)
            const followingRes = await client.query(
                "SELECT COUNT(*) FROM followers WHERE follower_id = $1",
                [userId],
            );
            const followingCount = parseInt(
                followingRes.rows[0].count,
            );

            await client.query(
                "UPDATE users SET followers_count = $1, following_count = $2 WHERE id = $3",
                [followersCount, followingCount, userId],
            );
        }

        await client.query("COMMIT");

        // Estadísticas finales
        console.log("\n" + "=".repeat(50));
        console.log("✅ ¡BASE DE DATOS POBLADA CON ÉXITO!");
        console.log("=".repeat(50));
        console.log("📊 ESTADÍSTICAS FINALES:");
        console.log(`👤 Usuarios: ${userIds.length}`);
        console.log(`🏷️ Tags: ${tagIds.length}`);
        console.log(`🧊 Modelos 3D: ${modelIds.length}`);

        // Contar relaciones
        const commentsCount = (
            await client.query(
                "SELECT COUNT(*) FROM comments",
            )
        ).rows[0].count;
        const likesCount = (
            await client.query(
                "SELECT COUNT(*) FROM model_likes",
            )
        ).rows[0].count;
        const favsCount = (
            await client.query(
                "SELECT COUNT(*) FROM favorites",
            )
        ).rows[0].count;
        const downloadsCount = (
            await client.query(
                "SELECT COUNT(*) FROM downloads",
            )
        ).rows[0].count;
        const followersCount = (
            await client.query(
                "SELECT COUNT(*) FROM followers",
            )
        ).rows[0].count;

        console.log(`💬 Comentarios: ${commentsCount}`);
        console.log(`❤️ Likes: ${likesCount}`);
        console.log(`⭐ Favoritos: ${favsCount}`);
        console.log(`📥 Descargas: ${downloadsCount}`);
        console.log(
            `🤝 Relaciones de seguidores: ${followersCount}`,
        );
        console.log("=".repeat(50));
        console.log("🔑 CREDENCIALES DE ACCESO:");
        console.log("Email Admin: admin@3dverse.com");
        console.log("Password Admin: admin123");
        console.log(
            "Password genérica de usuarios: user123",
        );
        console.log("=".repeat(50));
    } catch (error) {
        await client.query("ROLLBACK");
        console.error(
            "❌ Error durante el seeding:",
            error,
        );
    } finally {
        client.release();
        process.exit();
    }
};

seed();
