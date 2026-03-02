import pool from "../config/db.js";
import { faker } from "@faker-js/faker";
import { hashPassword } from "../utils/hashPassword.js";

const NUM_USERS = 10;
const NUM_MODELS = 20;
const NUM_TAGS = 10;

const seed = async () => {
    console.log("🌱 Iniciando el proceso de Seeding...");
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // 1. Limpiar la base de datos (CASCADE se encarga de borrar las dependencias)
        console.log("🧹 Limpiando base de datos...");
        await client.query("DELETE FROM users");
        await client.query("DELETE FROM tags");

        // 2. Crear tags
        console.log("🏷️ Creando Tags...");
        const tagIds = [];
        for (let i = 0; i < NUM_TAGS; i++) {
            const result = await client.query(
                "INSERT INTO tags (name) VALUES ($1) ON CONFLICT DO NOTHING RETURNING id",
                [
                    faker.word
                        .sample()
                        .substring(0, 50)
                        .toLowerCase(),
                ],
            );
            if (result.rows.length > 0)
                tagIds.push(result.rows[0].id);
        }

        // 3. Crear Usuarios (1 Admin y Varios falsos)
        console.log("👤 Creando Usuarios...");
        const userIds = [];

        // --- ADMIN PARA EL PROFESOR ---
        const adminPass = await hashPassword("admin123");
        const adminResult = await client.query(
            `INSERT INTO users (name, lastname, username, email, role, password_hash, bio, location) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
            [
                "Profesor",
                "Admin",
                "admin",
                "admin@3dverse.com",
                "admin",
                adminPass,
                "Cuenta de evaluación",
                "España",
            ],
        );
        userIds.push(adminResult.rows[0].id);

        // --- USUARIOS FALSOS ---
        // --- USUARIOS FALSOS ---
        const userPass = await hashPassword("user123");
        for (let i = 0; i < NUM_USERS; i++) {
            const result = await client.query(
                `INSERT INTO users (name, lastname, username, email, role, password_hash, avatar, bio) 
         VALUES ($1, $2, $3, $4, 'user', $5, $6, $7) RETURNING id`,
                [
                    faker.person.firstName(),
                    faker.person.lastName(),
                    faker.internet.username(),
                    faker.internet.email(),
                    userPass,
                    faker.image.avatar(),
                    faker.lorem.sentence(),
                ],
            );
            userIds.push(result.rows[0].id);
        }

        // 4. Crear Modelos
        console.log("🧊 Creando Modelos y relaciones...");
        const modelIds = [];
        for (let i = 0; i < NUM_MODELS; i++) {
            const randomUserId =
                faker.helpers.arrayElement(userIds);

            const modelResult = await client.query(
                `INSERT INTO models (user_id, title, main_color, description, file_url, main_image_url, downloads, views) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
                [
                    randomUserId,
                    faker.commerce.productName(),
                    faker.color.rgb(),
                    faker.commerce.productDescription(),
                    "/uploads/models/fake_model.zip", // Ruta falsa genérica
                    faker.image.urlPicsumPhotos({
                        width: 800,
                        height: 600,
                    }),
                    faker.number.int({ min: 0, max: 1000 }),
                    faker.number.int({ min: 0, max: 5000 }),
                ],
            );
            const modelId = modelResult.rows[0].id;
            modelIds.push(modelId);

            // Relación: Tags del modelo
            const numTagsForModel = faker.number.int({
                min: 1,
                max: 3,
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

            // Relación: Partes del modelo
            await client.query(
                `INSERT INTO model_parts (model_id, color, part_name, file_url, file_size) VALUES ($1, $2, $3, $4, $5)`,
                [
                    modelId,
                    faker.color.rgb(),
                    faker.commerce.productMaterial(),
                    "/uploads/models/part.stl",
                    1024500,
                ],
            );

            // Relación: Comentarios
            if (faker.datatype.boolean()) {
                await client.query(
                    "INSERT INTO comments (user_id, model_id, content) VALUES ($1, $2, $3)",
                    [
                        faker.helpers.arrayElement(userIds),
                        modelId,
                        faker.lorem.sentence(),
                    ],
                );
            }

            // Relación: Likes
            if (faker.datatype.boolean()) {
                await client.query(
                    "INSERT INTO model_likes (user_id, model_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
                    [
                        faker.helpers.arrayElement(userIds),
                        modelId,
                    ],
                );
            }
        }

        await client.query("COMMIT");
        console.log("✅ ¡Base de datos poblada con éxito!");
        console.log(
            "--------------------------------------------------",
        );
        console.log("Email Admin: admin@3dverse.com");
        console.log("Password Admin: admin123");
        console.log(
            "Password genérica de usuarios: user123",
        );
        console.log(
            "--------------------------------------------------",
        );
    } catch (error) {
        await client.query("ROLLBACK");
        console.error(
            "❌ Error durante el seeding:",
            error,
        );
    } finally {
        client.release();
        process.exit(); // Cierra el script
    }
};

seed();
