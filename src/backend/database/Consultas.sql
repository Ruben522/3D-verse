select * from users;

SELECT * from downloads;

SELECT * from model_tag;

SELECT * from model_parts;

SELECT * FROM downloads;

SELECT * FROM models;

SELECT * FROM categories;
-- Cambiar mi rol de user a admin
UPDATE users SET role = 'admin' WHERE name = 'Ruben';

SELECT file_url FROM models WHERE id = '46c6cae8-59af-4250-b6eb-7c901d15cd29';

ALTER TABLE models ALTER COLUMN main_image_url DROP NOT NULL;

CREATE TABLE categories (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE model_category (
    model_id uuid NOT NULL,
    category_id uuid NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (model_id, category_id),
    FOREIGN KEY (model_id) REFERENCES models(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE INDEX idx_model_category_category_id ON model_category(category_id);