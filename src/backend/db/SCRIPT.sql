-- DELETE TABLES (orden correcto: primero las que tienen dependencias)
DROP TABLE IF EXISTS followers;
DROP TABLE IF EXISTS model_tag;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS downloads;
DROP TABLE IF EXISTS model_images;
DROP TABLE IF EXISTS model_parts;
DROP TABLE IF EXISTS profiles;
DROP TABLE IF EXISTS models;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS users;
DROP TYPE IF EXISTS role_enum;

-- ENUM for user roles
CREATE TYPE role_enum AS ENUM ('admin', 'user');

-- USERS
CREATE TABLE users (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role role_enum NOT NULL DEFAULT 'user',
    
    lastname VARCHAR(255),
    avatar TEXT,
    bio TEXT,
    youtube VARCHAR(255),
    twitter VARCHAR(100),
    linkedin VARCHAR(100),
    github VARCHAR(100),
    location VARCHAR(255),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TAGS
CREATE TABLE tags (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- MODELS
CREATE TABLE models (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    title VARCHAR(255) NOT NULL,
    main_color VARCHAR(7),
    description TEXT,
    file_url TEXT NOT NULL,
    main_image_url TEXT NOT NULL,
    video_url TEXT,
    license VARCHAR(50) DEFAULT 'All Rights Reserved',
    downloads INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- MODEL PARTS
CREATE TABLE model_parts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    model_id UUID NOT NULL,
    color VARCHAR(7),
    part_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (model_id) REFERENCES models(id) ON DELETE CASCADE
);

-- GALLERY IMAGES
CREATE TABLE model_images (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    model_id UUID NOT NULL,
    image_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (model_id) REFERENCES models(id) ON DELETE CASCADE
);

-- COMMENTS
CREATE TABLE comments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    model_id uuid NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (model_id) REFERENCES models(id) ON DELETE CASCADE
);

-- FAVORITES
CREATE TABLE favorites (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    model_id uuid NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, model_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (model_id) REFERENCES models(id) ON DELETE CASCADE
);

-- DOWNLOADS
CREATE TABLE downloads (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid,
    model_id uuid NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (model_id) REFERENCES models(id) ON DELETE CASCADE
);

-- MODEL-TAG RELATION
CREATE TABLE model_tag (
    model_id uuid NOT NULL,
    tag_id uuid NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (model_id, tag_id),
    FOREIGN KEY (model_id) REFERENCES models(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- FOLLOWERS
CREATE TABLE followers (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    follower_id uuid NOT NULL,
    followed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, follower_id),
    CONSTRAINT no_self_follow CHECK (user_id <> follower_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE
);

-- MODEL LIKES RELATION
CREATE TABLE model_likes (
    user_id uuid NOT NULL,
    model_id uuid NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, model_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (model_id) REFERENCES models(id) ON DELETE CASCADE
);


-- ÍNDICES para mejorar rendimiento
CREATE INDEX idx_model_likes_user_id ON model_likes(user_id);
CREATE INDEX idx_model_likes_model_id ON model_likes(model_id);
CREATE INDEX idx_models_user_id ON models(user_id);
CREATE INDEX idx_models_created_at ON models(created_at DESC);
CREATE INDEX idx_comments_model_id ON comments(model_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_model_id ON favorites(model_id);
CREATE INDEX idx_downloads_model_id ON downloads(model_id);
CREATE INDEX idx_downloads_user_id ON downloads(user_id);
CREATE INDEX idx_model_parts_model_id ON model_parts(model_id);
CREATE INDEX idx_model_images_model_id ON model_images(model_id);
CREATE INDEX idx_model_tag_tag_id ON model_tag(tag_id);
CREATE INDEX idx_followers_user_id ON followers(user_id);
CREATE INDEX idx_followers_follower_id ON followers(follower_id);