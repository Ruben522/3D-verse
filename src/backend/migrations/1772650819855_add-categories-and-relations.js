export async function up(pgm) {
    pgm.sql(`
        -- 1. Tabla de Categorías
        CREATE TABLE categories (
            id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
            name VARCHAR(100) UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- 2. Tabla puente Muchos a Muchos
        CREATE TABLE model_category (
            model_id uuid NOT NULL,
            category_id uuid NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (model_id, category_id),
            FOREIGN KEY (model_id) REFERENCES models(id) ON DELETE CASCADE,
            FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
        );

        -- 3. Índice de búsqueda
        CREATE INDEX idx_model_category_category_id ON model_category(category_id);
    `);
}

export async function down(pgm) {
    pgm.sql(`
        DROP TABLE IF EXISTS model_category;
        DROP TABLE IF EXISTS categories;
    `);
}