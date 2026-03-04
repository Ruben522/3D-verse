select * from users;

SELECT * from downloads;

SELECT * from model_tag;

SELECT * from model_parts;

SELECT * FROM downloads;

SELECT * FROM models;
-- Cambiar mi rol de user a admin
UPDATE users SET role = 'admin' WHERE name = 'Ruben';

SELECT file_url FROM models WHERE id = '46c6cae8-59af-4250-b6eb-7c901d15cd29';

ALTER TABLE models ALTER COLUMN main_image_url DROP NOT NULL;