select * from users;

SELECT * from downloads;

SELECT * from model_tag;

SELECT * from model_parts;

SELECT * FROM downloads;

SELECT * FROM models;

DELETE FROM models;

SELECT * FROM categories;

SELECT * FROM model_images WHERE id = '72c8cb7c-e5b6-4a16-a044-c5864bbb2146';
-- Cambiar mi rol de user a admin
UPDATE users SET role = 'admin' WHERE email = 'rubiosax52@gmail.com';

SELECT file_url FROM models WHERE id = '46c6cae8-59af-4250-b6eb-7c901d15cd29';

ALTER TABLE models ALTER COLUMN main_image_url DROP NOT NULL;

-- Ejecuta en tu cliente SQL (pgAdmin, DBeaver, etc.)
ALTER TABLE users DROP CONSTRAINT users_username_key;
