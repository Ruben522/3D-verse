-- DELETE TABLES
DROP TABLE IF EXISTS followers;
DROP TABLE IF EXISTS model_tag;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS downloads;
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS models;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS model_images;
DROP TABLE IF EXISTS model_parts;
DROP TYPE IF EXISTS role_enum;

-- ENUM for user roles
CREATE TYPE role_enum AS ENUM ('admin', 'user');

-- USERS
CREATE TABLE users (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    lastname VARCHAR(255),
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role role_enum NOT NULL DEFAULT 'user',
    password_hash TEXT NOT NULL,
    avatar TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- MODELS
CREATE TABLE models (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    main_image_url TEXT NOT NULL,
    video_url TEXT,
    license VARCHAR(50),
    downloads INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- MODELS PARTS
CREATE TABLE model_parts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    model_id UUID REFERENCES models(id),
    part_name VARCHAR(255),
    file_url TEXT NOT NULL,
    file_size BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- GALERY IMAGES
CREATE TABLE model_images (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    model_id UUID NOT NULL REFERENCES models(id),
    image_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0
);

-- COMMENTS
CREATE TABLE comments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    model_id uuid NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- FAVORITES
CREATE TABLE favorites (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    model_id uuid NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DOWNLOADS
CREATE TABLE downloads (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid,
    model_id uuid NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TAGS
CREATE TABLE tags (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

-- MODEL-TAG RELATION
CREATE TABLE model_tag (
    model_id uuid NOT NULL,
    tag_id uuid NOT NULL,
    PRIMARY KEY (model_id, tag_id)
);

-- FOLLOWERS
CREATE TABLE followers (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,       -- the user being followed
    follower_id uuid NOT NULL,   -- the user who follows
    followed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT no_self_follow CHECK (user_id <> follower_id)
);

---------------------------------------------------------
-- FOREIGN KEYS (all grouped here for readability)
---------------------------------------------------------
ALTER TABLE models
    ADD FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE;
    

ALTER TABLE comments
    ADD FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
    ADD FOREIGN KEY (model_id)
    REFERENCES models(id)
    ON DELETE CASCADE;

ALTER TABLE favorites
    ADD FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
    ADD FOREIGN KEY (model_id)
    REFERENCES models(id)
    ON DELETE CASCADE;

ALTER TABLE downloads
    ADD FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE SET NULL,
    ADD FOREIGN KEY (model_id)
    REFERENCES models(id)
    ON DELETE CASCADE;

ALTER TABLE model_tag
    ADD FOREIGN KEY (model_id)
    REFERENCES models(id)
    ON DELETE CASCADE,
    ADD FOREIGN KEY (tag_id)
    REFERENCES tags(id)
    ON DELETE CASCADE;

ALTER TABLE followers
    ADD FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
    ADD FOREIGN KEY (follower_id)
    REFERENCES users(id)
    ON DELETE CASCADE;

ALTER TABLE model_images
    ADD FOREIGN KEY (model_id)
    REFERENCES models(id)
    ON DELETE CASCADE;

ALTER TABLE model_parts
    ADD FOREIGN KEY (model_id)
    REFERENCES models(id)
    ON DELETE CASCADE;