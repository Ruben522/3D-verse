-- PRIMERO: Insertar usuarios (10 usuarios) - estos están bien porque usan el formato correcto
DELETE FROM users; -- Limpiar tabla antes de insertar datos falsos
DELETE FROM tags; -- Limpiar tabla antes de insertar datos falsos
DELETE FROM models; -- Limpiar tabla antes de insertar datos falsos
DELETE FROM favorites; -- Limpiar tabla antes de insertar datos falsos
DELETE FROM model_likes; -- Limpiar tabla antes de insertar datos falsos
DELETE FROM comments; -- Limpiar tabla antes de insertar datos falsos
DELETE FROM followers;

INSERT INTO users (id, name, lastname, username, email, password_hash, role, avatar, bio, youtube, twitter, linkedin, github, location) VALUES
('11111111-1111-1111-1111-111111111119', 'R', 'R', 'R', 'R.garcia@email.com', '$2a$10$HASHEXAMPLE1', 'user', 'https://storage.com/avatars/ana.jpg', 'R 3D especializada en personajes fantásticos', '@Ana3D', '@ana_3d', 'ana-garcia-3d', 'anagarcia3d', 'Madrid, España'),

('11111111-1111-1111-1111-111111111111', 'Ana', 'García', 'ana3d', 'ana.garcia@email.com', '$2a$10$HASHEXAMPLE1', 'user', 'https://storage.com/avatars/ana.jpg', 'Diseñadora 3D especializada en personajes fantásticos', '@Ana3D', '@ana_3d', 'ana-garcia-3d', 'anagarcia3d', 'Madrid, España'),
('22222222-2222-2222-2222-222222222222', 'Carlos', 'Rodríguez', 'carlos3d', 'carlos.rodriguez@email.com', '$2a$10$HASHEXAMPLE2', 'user', 'https://storage.com/avatars/carlos.jpg', 'Ingeniero mecánico creando piezas funcionales para impresión 3D', '@CarlosMech', '@carlos_mech', 'carlos-rodriguez', 'carlosmech', 'Barcelona, España'),
('33333333-3333-3333-3333-333333333333', 'Laura', 'Martínez', 'lauradesigns', 'laura.martinez@email.com', '$2a$10$HASHEXAMPLE3', 'user', 'https://storage.com/avatars/laura.jpg', 'Arquitecta convertida en diseñadora 3D. Modelos orgánicos y paramétricos', '@LauraDesigns', '@laura_designs', 'laura-martinez', 'lauradesigns', 'Valencia, España'),
('44444444-4444-4444-4444-444444444444', 'Miguel', 'López', 'miguel3d', 'miguel.lopez@email.com', '$2a$10$HASHEXAMPLE4', 'user', 'https://storage.com/avatars/miguel.jpg', 'Creando miniaturas para juegos de mesa y rol', '@Miguel3D', '@miguel_minis', 'miguel-lopez', 'miguel3d', 'Sevilla, España'),
('55555555-5555-5555-5555-555555555555', 'Sofia', 'Fernández', 'sofia3d', 'sofia.fernandez@email.com', '$2a$10$HASHEXAMPLE5', 'admin', 'https://storage.com/avatars/sofia.jpg', 'Admin y diseñadora. Me encanta la joyería paramétrica', '@SofiaJewelry', '@sofia_3d', 'sofia-fernandez', 'sofiajewelry', 'Bilbao, España'),
('66666666-6666-6666-6666-666666666666', 'David', 'González', 'david3dprints', 'david.gonzalez@email.com', '$2a$10$HASHEXAMPLE6', 'user', 'https://storage.com/avatars/david.jpg', 'Ingeniero industrial, especialista en piezas mecánicas y prototipado', '@DavidPrints', '@david_prints', 'david-gonzalez', 'david3d', 'Zaragoza, España'),
('77777777-7777-7777-7777-777777777777', 'Elena', 'Sánchez', 'elenacreations', 'elena.sanchez@email.com', '$2a$10$HASHEXAMPLE7', 'user', 'https://storage.com/avatars/elena.jpg', 'Artista digital creando esculturas orgánicas y criaturas fantásticas', '@ElenaArt', '@elena_art', 'elena-sanchez', 'elenacreations', 'Granada, España'),
('88888888-8888-8888-8888-888888888888', 'Javier', 'Ruiz', 'javier3d', 'javier.ruiz@email.com', '$2a$10$HASHEXAMPLE8', 'user', 'https://storage.com/avatars/javier.jpg', 'Diseñador de accesorios y gadgets para impresión 3D funcional', '@JavierGadgets', '@javier_gadgets', 'javier-ruiz', 'javier3d', 'Alicante, España'),
('99999999-9999-9999-9999-999999999999', 'Carmen', 'Díaz', 'carmen3d', 'carmen.diaz@email.com', '$2a$10$HASHEXAMPLE9', 'user', 'https://storage.com/avatars/carmen.jpg', 'Creando decoración y arte para el hogar con impresión 3D', '@CarmenHome', '@carmen_home', 'carmen-diaz', 'carmen3d', 'Málaga, España'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Pablo', 'Torres', 'pablo3d', 'pablo.torres@email.com', '$2a$10$HASHEXAMPLE0', 'user', 'https://storage.com/avatars/pablo.jpg', 'Estudiante de ingeniería, comparto mis proyectos y prácticas', '@PabloPrints', '@pablo_prints', 'pablo-torres', 'pablo3d', 'Murcia, España');

-- SEGUNDO: Insertar tags (15 tags populares) - AHORA CON UUIDs CORRECTOS
INSERT INTO tags (id, name) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'dragón'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'figura'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'funcional'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'joyería'),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'miniaturas'),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'dungeons-and-dragons'),
('a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', 'organizador'),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', 'arte'),
('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', 'mecánico'),
('d1eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', 'decoración'),
('e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'gadget'),
('f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'escultura'),
('a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a23', 'arquitectura'),
('b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a24', 'juguete'),
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a25', 'herramienta');

-- TERCERO: Insertar modelos (15 modelos) - AHORA CON UUIDs CORRECTOS
INSERT INTO models (id, user_id, title, main_color, description, file_url, main_image_url, video_url, license, downloads, views, created_at) VALUES
('a1a1a1a1-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Dragón Esmeralda', '#00FF00', 'Dragón fantástico con alas articuladas. Inspirado en la mitología medieval. Viene en 3 partes para facilitar la impresión.', 'https://storage.com/models/dragon-esmeralda.stl', 'https://storage.com/images/dragon-esmeralda.jpg', 'https://youtube.com/watch?v=dragon1', 'Creative Commons BY', 245, 1234, '2024-01-15 10:30:00'),
('b2b2b2b2-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Engranaje Planetario', '#FF0000', 'Sistema de engranajes planetarios funcional. Perfecto para proyectos educativos o mecánicos.', 'https://storage.com/models/engranaje-planetario.stl', 'https://storage.com/images/engranaje.jpg', NULL, 'MIT', 567, 3456, '2024-01-20 15:45:00'),
('c3c3c3c3-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'Vaso Paramétrico', '#3366FF', 'Vaso con diseño paramétrico, personalizable en altura y diámetro. Ideal para bolígrafos o pinceles.', 'https://storage.com/models/vaso-parametrico.stl', 'https://storage.com/images/vaso.jpg', 'https://youtube.com/watch?v=vaso1', 'MIT', 128, 2345, '2024-02-01 09:15:00'),
('d4d4d4d4-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'Guerrero Élfico', '#FFAA00', 'Miniatura de guerrero élfico para juegos de rol. Alta resolución, lista para imprimir.', 'https://storage.com/models/guerrero-elfico.stl', 'https://storage.com/images/guerrero.jpg', 'https://youtube.com/watch?v=elfo1', 'Creative Commons BY', 892, 5678, '2024-02-10 12:00:00'),
('e5e5e5e5-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 'Anillo Dragón', '#FFD700', 'Anillo con diseño de dragón enroscado. Ajustable a diferentes tallas.', 'https://storage.com/models/anillo-dragon.stl', 'https://storage.com/images/anillo.jpg', 'https://youtube.com/watch?v=anillo1', 'All Rights Reserved', 156, 3452, '2024-02-15 16:20:00'),
('f6f6f6f6-6666-6666-6666-666666666666', '66666666-6666-6666-6666-666666666666', 'Soporte Modular', '#888888', 'Sistema de soportes modulares para organizar herramientas y materiales.', 'https://storage.com/models/soporte-modular.stl', 'https://storage.com/images/soporte.jpg', NULL, 'GPL', 423, 2341, '2024-02-20 11:30:00'),
('a7a7a7a7-7777-7777-7777-777777777777', '77777777-7777-7777-7777-777777777777', 'Criatura Lovecraftiana', '#440044', 'Escultura de criatura inspirada en los mitos de Lovecraft. Textura detallada.', 'https://storage.com/models/lovecraft.stl', 'https://storage.com/images/lovecraft.jpg', 'https://youtube.com/watch?v=lovecraft1', 'Creative Commons BY', 678, 7890, '2024-03-01 14:00:00'),
('b8b8b8b8-8888-8888-8888-888888888888', '88888888-8888-8888-8888-888888888888', 'Caja Engranajes', '#FF6600', 'Caja con tapa de engranajes decorativos. Perfecta para guardar pequeños objetos.', 'https://storage.com/models/caja-engranajes.stl', 'https://storage.com/images/caja.jpg', NULL, 'MIT', 234, 1876, '2024-03-05 10:45:00'),
('c9c9c9c9-9999-9999-9999-999999999999', '99999999-9999-9999-9999-999999999999', 'Maceta Geométrica', '#99CC00', 'Maceta con diseño geométrico moderno. Incluye plato a juego.', 'https://storage.com/models/maceta-geometrica.stl', 'https://storage.com/images/maceta.jpg', 'https://youtube.com/watch?v=maceta1', 'Creative Commons BY', 345, 2987, '2024-03-10 13:15:00'),
('d0d0d0d0-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Portalápices Dinosaurio', '#663300', 'Portalápices con forma de dinosaurio. Divertido y funcional para escritorio.', 'https://storage.com/models/portalapices-dino.stl', 'https://storage.com/images/portalapices.jpg', NULL, 'MIT', 167, 1432, '2024-03-15 17:30:00'),
('e1e1e1e1-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'Fénix Real', '#FF5500', 'Escultura de fénix con plumaje detallado. Pieza de colección.', 'https://storage.com/models/fenix.stl', 'https://storage.com/images/fenix.jpg', 'https://youtube.com/watch?v=fenix1', 'All Rights Reserved', 89, 2341, '2024-03-20 08:00:00'),
('f2f2f2f2-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 'Polea Ajustable', '#CCCCCC', 'Polea con rodamiento integrado, ajustable a diferentes diámetros de cuerda.', 'https://storage.com/models/polea.stl', 'https://storage.com/images/polea.jpg', NULL, 'GPL', 234, 1987, '2024-03-25 12:45:00'),
('a3a3a3a3-dddd-dddd-dddd-dddddddddddd', '33333333-3333-3333-3333-333333333333', 'Lámpara Voronoi', '#FFFFAA', 'Pantalla de lámpara con patrón Voronoi. Crea sombras espectaculares.', 'https://storage.com/models/lampara-voronoi.stl', 'https://storage.com/images/lampara.jpg', 'https://youtube.com/watch?v=lampara1', 'Creative Commons BY', 456, 3456, '2024-04-01 19:00:00'),
('b4b4b4b4-eeee-eeee-eeee-eeeeeeeeeeee', '44444444-4444-4444-4444-444444444444', 'Castillo Modular', '#AA8866', 'Castillo modular para juegos de mesa. Piezas intercambiables.', 'https://storage.com/models/castillo.stl', 'https://storage.com/images/castillo.jpg', 'https://youtube.com/watch?v=castillo1', 'MIT', 567, 6789, '2024-04-05 10:00:00'),
('c5c5c5c5-ffff-ffff-ffff-ffffffffffff', '55555555-5555-5555-5555-555555555555', 'Collar Geométrico', '#C0C0C0', 'Collar de diseño geométrico paramétrico. Ajustable y ligero.', 'https://storage.com/models/collar.stl', 'https://storage.com/images/collar.jpg', 'https://youtube.com/watch?v=collar1', 'Creative Commons BY', 123, 1876, '2024-04-10 16:30:00');
-- INSERT FAVORITOS con IDs directos (15 registros)
INSERT INTO favorites (user_id, model_id, created_at) VALUES
-- Ana (ana3d) favoritos
('11111111-1111-1111-1111-111111111111', 'b2b2b2b2-2222-2222-2222-222222222222', '2024-02-05 12:15:00'),
('11111111-1111-1111-1111-111111111111', 'a7a7a7a7-7777-7777-7777-777777777777', '2024-03-02 16:30:00'),
('11111111-1111-1111-1111-111111111111', 'c5c5c5c5-ffff-ffff-ffff-ffffffffffff', '2024-04-12 10:20:00'),

-- Carlos (carlos3d) favoritos
('22222222-2222-2222-2222-222222222222', 'a1a1a1a1-1111-1111-1111-111111111111', '2024-02-01 10:30:00'),
('22222222-2222-2222-2222-222222222222', 'c3c3c3c3-3333-3333-3333-333333333333', '2024-02-10 11:00:00'),
('22222222-2222-2222-2222-222222222222', 'c9c9c9c9-9999-9999-9999-999999999999', '2024-03-12 13:20:00'),

-- Laura (lauradesigns) favoritos
('33333333-3333-3333-3333-333333333333', 'a1a1a1a1-1111-1111-1111-111111111111', '2024-02-02 15:20:00'),
('33333333-3333-3333-3333-333333333333', 'b2b2b2b2-2222-2222-2222-222222222222', '2024-02-06 18:30:00'),
('33333333-3333-3333-3333-333333333333', 'd0d0d0d0-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2024-03-18 15:40:00'),

-- Miguel (miguel3d) favoritos
('44444444-4444-4444-4444-444444444444', 'a1a1a1a1-1111-1111-1111-111111111111', '2024-02-03 09:45:00'),
('44444444-4444-4444-4444-444444444444', 'e1e1e1e1-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '2024-03-22 11:10:00'),

-- Sofia (sofia3d) favoritos
('55555555-5555-5555-5555-555555555555', 'c3c3c3c3-3333-3333-3333-333333333333', '2024-02-10 11:00:00'),
('55555555-5555-5555-5555-555555555555', 'e5e5e5e5-5555-5555-5555-555555555555', '2024-02-18 11:00:00'),

-- David (david3dprints) favoritos
('66666666-6666-6666-6666-666666666666', 'd4d4d4d4-4444-4444-4444-444444444444', '2024-02-15 14:30:00'),

-- Elena (elenacreations) favoritos
('77777777-7777-7777-7777-777777777777', 'd4d4d4d4-4444-4444-4444-444444444444', '2024-02-16 09:20:00');

-- INSERT MODEL LIKES (15 registros)
INSERT INTO model_likes (user_id, model_id, created_at) VALUES
-- Dragón Esmeralda (más likes)
('22222222-2222-2222-2222-222222222222', 'a1a1a1a1-1111-1111-1111-111111111111', '2024-02-01 10:32:00'),
('33333333-3333-3333-3333-333333333333', 'a1a1a1a1-1111-1111-1111-111111111111', '2024-02-02 15:22:00'),
('44444444-4444-4444-4444-444444444444', 'a1a1a1a1-1111-1111-1111-111111111111', '2024-02-03 09:47:00'),
('55555555-5555-5555-5555-555555555555', 'a1a1a1a1-1111-1111-1111-111111111111', '2024-02-04 11:15:00'),

-- Engranaje Planetario
('11111111-1111-1111-1111-111111111111', 'b2b2b2b2-2222-2222-2222-222222222222', '2024-02-05 12:16:00'),
('44444444-4444-4444-4444-444444444444', 'b2b2b2b2-2222-2222-2222-222222222222', '2024-02-06 18:31:00'),
('66666666-6666-6666-6666-666666666666', 'b2b2b2b2-2222-2222-2222-222222222222', '2024-02-07 09:10:00'),

-- Vaso Paramétrico
('55555555-5555-5555-5555-555555555555', 'c3c3c3c3-3333-3333-3333-333333333333', '2024-02-10 11:02:00'),
('77777777-7777-7777-7777-777777777777', 'c3c3c3c3-3333-3333-3333-333333333333', '2024-02-11 14:30:00'),

-- Guerrero Élfico
('11111111-1111-1111-1111-111111111111', 'd4d4d4d4-4444-4444-4444-444444444444', '2024-02-15 14:31:00'),
('88888888-8888-8888-8888-888888888888', 'd4d4d4d4-4444-4444-4444-444444444444', '2024-02-16 10:20:00'),

-- Anillo Dragón
('33333333-3333-3333-3333-333333333333', 'e5e5e5e5-5555-5555-5555-555555555555', '2024-02-18 11:05:00'),
('99999999-9999-9999-9999-999999999999', 'e5e5e5e5-5555-5555-5555-555555555555', '2024-02-19 16:45:00'),

-- Criatura Lovecraftiana
('22222222-2222-2222-2222-222222222222', 'a7a7a7a7-7777-7777-7777-777777777777', '2024-03-02 16:35:00'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a7a7a7a7-7777-7777-7777-777777777777', '2024-03-03 12:10:00');

-- INSERT COMMENTS (15 comentarios adicionales)
INSERT INTO comments (user_id, model_id, content, created_at) VALUES
-- Comentarios sobre Dragón Esmeralda
('55555555-5555-5555-5555-555555555555', 'a1a1a1a1-1111-1111-1111-111111111111', '¿Qué altura tiene aproximadamente? Me gustaría saber si entra en mi impresora.', '2024-02-04 11:20:00'),
('66666666-6666-6666-6666-666666666666', 'a1a1a1a1-1111-1111-1111-111111111111', 'Acabo de imprimirlo y quedó espectacular. Usé PLA a 0.2mm de capa.', '2024-02-05 09:15:00'),
('77777777-7777-7777-7777-777777777777', 'a1a1a1a1-1111-1111-1111-111111111111', '¿Alguien ha probado a imprimirlo en resina? Me pregunto si los detalles se aprecian más.', '2024-02-06 16:40:00'),

-- Comentarios sobre Engranaje Planetario
('88888888-8888-8888-8888-888888888888', 'b2b2b2b2-2222-2222-2222-222222222222', 'Lo usé para enseñar mecánica a mis alumnos y funcionó perfecto. Muy didáctico.', '2024-02-07 10:30:00'),
('99999999-9999-9999-9999-999999999999', 'b2b2b2b2-2222-2222-2222-222222222222', '¿Alguien tiene problemas con los engranajes satélite? Los míos no encajan bien.', '2024-02-08 14:20:00'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b2b2b2b2-2222-2222-2222-222222222222', 'Prueba a escalar al 101% los satélites, a mí me funcionó.', '2024-02-08 18:45:00'),

-- Comentarios sobre Vaso Paramétrico
('11111111-1111-1111-1111-111111111111', 'c3c3c3c3-3333-3333-3333-333333333333', 'Lo personalicé para mis pinceles, quedó perfecto. Muy buen diseño.', '2024-02-11 09:30:00'),
('22222222-2222-2222-2222-222222222222', 'c3c3c3c3-3333-3333-3333-333333333333', '¿Se puede modificar el código para hacerlo más ancho?', '2024-02-12 11:15:00'),
('33333333-3333-3333-3333-333333333333', 'c3c3c3c3-3333-3333-3333-333333333333', 'Sí, en los parámetros iniciales puedes cambiar el diámetro fácilmente.', '2024-02-12 15:20:00'),

-- Comentarios sobre Guerrero Élfico
('44444444-4444-4444-4444-444444444444', 'd4d4d4d4-4444-4444-4444-444444444444', 'Los detalles de la armadura son impresionantes. Muy buen trabajo.', '2024-02-16 11:30:00'),
('55555555-5555-5555-5555-555555555555', 'd4d4d4d4-4444-4444-4444-444444444444', '¿Recomiendas usar soportes para las manos?', '2024-02-17 10:15:00'),
('66666666-6666-6666-6666-666666666666', 'd4d4d4d4-4444-4444-4444-444444444444', 'Yo usé soportes en árbol y se ve perfecto.', '2024-02-17 14:30:00'),

-- Comentarios sobre Anillo Dragón
('77777777-7777-7777-7777-777777777777', 'e5e5e5e5-5555-5555-5555-555555555555', '¿Es resistente para uso diario? Me preocupa que se rompa.', '2024-02-19 12:45:00'),
('88888888-8888-8888-8888-888888888888', 'e5e5e5e5-5555-5555-5555-555555555555', 'Lo imprimí en PETG y ha aguantado perfecto un mes ya.', '2024-02-20 09:30:00'),
('99999999-9999-9999-9999-999999999999', 'e5e5e5e5-5555-5555-5555-555555555555', 'El diseño es precioso, mi mujer lo adora.', '2024-02-21 16:20:00');

UPDATE users 
SET role = 'admin' 
WHERE username = 'ruben_admin';

-- 10 FAVORITOS ADICIONALES
INSERT INTO favorites (user_id, model_id, created_at) VALUES
-- Javier (javier3d) favoritos
('88888888-8888-8888-8888-888888888888', 'f6f6f6f6-6666-6666-6666-666666666666', '2024-02-22 11:30:00'),
('88888888-8888-8888-8888-888888888888', 'b8b8b8b8-8888-8888-8888-888888888888', '2024-03-07 09:45:00'),
('88888888-8888-8888-8888-888888888888', 'a3a3a3a3-dddd-dddd-dddd-dddddddddddd', '2024-04-02 16:20:00'),

-- Carmen (carmen3d) favoritos
('99999999-9999-9999-9999-999999999999', 'f6f6f6f6-6666-6666-6666-666666666666', '2024-02-23 10:15:00'),
('99999999-9999-9999-9999-999999999999', 'c9c9c9c9-9999-9999-9999-999999999999', '2024-03-11 12:30:00'),

-- Pablo (pablo3d) favoritos
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'd0d0d0d0-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2024-03-16 18:20:00'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'f2f2f2f2-cccc-cccc-cccc-cccccccccccc', '2024-03-26 14:45:00'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b4b4b4b4-eeee-eeee-eeee-eeeeeeeeeeee', '2024-04-06 11:10:00'),

-- Más favoritos de Ana
('11111111-1111-1111-1111-111111111111', 'e1e1e1e1-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '2024-03-21 09:30:00'),
('11111111-1111-1111-1111-111111111111', 'b4b4b4b4-eeee-eeee-eeee-eeeeeeeeeeee', '2024-04-07 15:40:00');

-- 10 MODEL LIKES ADICIONALES
INSERT INTO model_likes (user_id, model_id, created_at) VALUES
-- Caja Engranajes
('11111111-1111-1111-1111-111111111111', 'b8b8b8b8-8888-8888-8888-888888888888', '2024-03-06 10:30:00'),
('33333333-3333-3333-3333-333333333333', 'b8b8b8b8-8888-8888-8888-888888888888', '2024-03-06 14:20:00'),

-- Maceta Geométrica
('22222222-2222-2222-2222-222222222222', 'c9c9c9c9-9999-9999-9999-999999999999', '2024-03-11 13:15:00'),
('44444444-4444-4444-4444-444444444444', 'c9c9c9c9-9999-9999-9999-999999999999', '2024-03-12 10:45:00'),

-- Portalápices Dinosaurio
('55555555-5555-5555-5555-555555555555', 'd0d0d0d0-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2024-03-16 17:30:00'),
('66666666-6666-6666-6666-666666666666', 'd0d0d0d0-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2024-03-17 09:20:00'),

-- Fénix Real
('77777777-7777-7777-7777-777777777777', 'e1e1e1e1-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '2024-03-21 08:45:00'),
('88888888-8888-8888-8888-888888888888', 'e1e1e1e1-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '2024-03-22 11:30:00'),

-- Castillo Modular
('99999999-9999-9999-9999-999999999999', 'b4b4b4b4-eeee-eeee-eeee-eeeeeeeeeeee', '2024-04-06 10:15:00'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b4b4b4b4-eeee-eeee-eeee-eeeeeeeeeeee', '2024-04-07 14:30:00');

-- 10 COMMENTS ADICIONALES
INSERT INTO comments (user_id, model_id, content, created_at) VALUES
-- Caja Engranajes
('11111111-1111-1111-1111-111111111111', 'b8b8b8b8-8888-8888-8888-888888888888', 'Me encanta el diseño, muy original lo de los engranajes decorativos.', '2024-03-06 11:30:00'),
('22222222-2222-2222-2222-222222222222', 'b8b8b8b8-8888-8888-8888-888888888888', '¿Las medidas son estándar? Me vendría bien para unos componentes.', '2024-03-07 09:15:00'),

-- Maceta Geométrica
('33333333-3333-3333-3333-333333333333', 'c9c9c9c9-9999-9999-9999-999999999999', 'La imprimí en maceta grande y quedó preciosa en el salón.', '2024-03-11 14:20:00'),
('44444444-4444-4444-4444-444444444444', 'c9c9c9c9-9999-9999-9999-999999999999', '¿El plato encaja bien? Me preocupa que entre agua.', '2024-03-12 11:30:00'),

-- Portalápices Dinosaurio
('55555555-5555-5555-5555-555555555555', 'd0d0d0d0-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'A mi hijo le encantó, ahora quiere uno de T-Rex jaja', '2024-03-16 18:45:00'),
('66666666-6666-6666-6666-666666666666', 'd0d0d0d0-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Imprime sin problemas, muy buen diseño.', '2024-03-17 10:30:00'),

-- Fénix Real
('77777777-7777-7777-7777-777777777777', 'e1e1e1e1-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Las plumas son impresionantes, mucho detalle.', '2024-03-21 09:15:00'),
('88888888-8888-8888-8888-888888888888', 'e1e1e1e1-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '¿Cuántas horas de impresión son aproximadamente?', '2024-03-22 12:20:00'),

-- Castillo Modular
('99999999-9999-9999-9999-999999999999', 'b4b4b4b4-eeee-eeee-eeee-eeeeeeeeeeee', 'Perfecto para mis partidas de D&D, los jugadores alucinaron.', '2024-04-06 11:30:00'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b4b4b4b4-eeee-eeee-eeee-eeeeeeeeeeee', '¿Los módulos encajan bien entre sí?', '2024-04-07 15:20:00');

-- 15 FOLLOWERS (relaciones de seguimiento)
INSERT INTO followers (user_id, follower_id, followed_at) VALUES
-- Ana sigue a...
('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '2024-01-05 10:30:00'), -- Ana sigue a Carlos
('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', '2024-01-06 11:45:00'), -- Ana sigue a Laura
('11111111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555', '2024-01-07 09:20:00'), -- Ana sigue a Sofia

-- Carlos sigue a...
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', '2024-01-08 14:15:00'), -- Carlos sigue a Ana
('22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', '2024-01-09 16:30:00'), -- Carlos sigue a Miguel
('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666666', '2024-01-10 10:45:00'), -- Carlos sigue a David

-- Laura sigue a...
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', '2024-01-11 12:20:00'), -- Laura sigue a Ana
('33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', '2024-01-12 13:40:00'), -- Laura sigue a Miguel
('33333333-3333-3333-3333-333333333333', '77777777-7777-7777-7777-777777777777', '2024-01-13 15:10:00'), -- Laura sigue a Elena

-- Miguel sigue a...
('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', '2024-01-14 09:50:00'), -- Miguel sigue a Ana
('44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', '2024-01-15 11:25:00'), -- Miguel sigue a Carlos
('44444444-4444-4444-4444-444444444444', '88888888-8888-8888-8888-888888888888', '2024-01-16 14:35:00'), -- Miguel sigue a Javier

-- Sofia sigue a...
('55555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', '2024-01-17 10:15:00'), -- Sofia sigue a Ana
('55555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', '2024-01-18 12:40:00'), -- Sofia sigue a Carlos
('55555555-5555-5555-5555-555555555555', '99999999-9999-9999-9999-999999999999', '2024-01-19 16:20:00'); -- Sofia sigue a Carmen

-- NOTA: He eliminado la línea del UPDATE porque el usuario 'ruben_admin' no existe
-- Si quieres añadir a Ruben como admin, primero debes insertarlo:
-- INSERT INTO users (id, username, email, password_hash, role) VALUES 
-- ('rrrrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr', 'ruben_admin', 'ruben@email.com', '$2a$10$HASH', 'admin');

-- INSERT MODEL_TAG (relaciones modelo-tag) - 40 registros
INSERT INTO model_tag (model_id, tag_id, created_at) VALUES



-- Guerrero Élfico (d4d4d4d4-4444-4444-4444-444444444444)
('d4d4d4d4-4444-4444-4444-444444444444', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', '2024-02-10 12:30:00'), -- miniaturas
('d4d4d4d4-4444-4444-4444-444444444444', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', '2024-02-10 12:30:00'), -- dungeons-and-dragons
('d4d4d4d4-4444-4444-4444-444444444444', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', '2024-02-10 12:30:00'), -- figura
('d4d4d4d4-4444-4444-4444-444444444444', 'b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a24', '2024-02-10 12:30:00'), -- juguete

-- Anillo Dragón (e5e5e5e5-5555-5555-5555-555555555555)
('e5e5e5e5-5555-5555-5555-555555555555', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', '2024-02-15 17:00:00'), -- joyería
('e5e5e5e5-5555-5555-5555-555555555555', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2024-02-15 17:00:00'), -- dragón
('e5e5e5e5-5555-5555-5555-555555555555', 'f2eebc99-9c0b-4ef8-bb6d-6bb9bd380a28', '2024-02-15 17:00:00'), -- joyería-paramétrica

-- Soporte Modular (f6f6f6f6-6666-6666-6666-666666666666)
('f6f6f6f6-6666-6666-6666-666666666666', 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', '2024-02-20 12:00:00'), -- organizador
('f6f6f6f6-6666-6666-6666-666666666666', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', '2024-02-20 12:00:00'), -- funcional
('f6f6f6f6-6666-6666-6666-666666666666', 'e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', '2024-02-20 12:00:00'), -- gadget
('f6f6f6f6-6666-6666-6666-666666666666', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a25', '2024-02-20 12:00:00'), -- herramienta

-- Criatura Lovecraftiana (a7a7a7a7-7777-7777-7777-777777777777)
('a7a7a7a7-7777-7777-7777-777777777777', 'f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2024-03-01 14:30:00'), -- escultura
('a7a7a7a7-7777-7777-7777-777777777777', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', '2024-03-01 14:30:00'), -- arte
('a7a7a7a7-7777-7777-7777-777777777777', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', '2024-03-01 14:30:00'), -- figura

-- Caja Engranajes (b8b8b8b8-8888-8888-8888-888888888888)
('b8b8b8b8-8888-8888-8888-888888888888', 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', '2024-03-05 11:15:00'), -- organizador
('b8b8b8b8-8888-8888-8888-888888888888', 'd1eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', '2024-03-05 11:15:00'), -- decoración
('b8b8b8b8-8888-8888-8888-888888888888', 'a3eebc99-9c0b-4ef8-bb6d-6bb9bd380a29', '2024-03-05 11:15:00'), -- engranajes

-- Maceta Geométrica (c9c9c9c9-9999-9999-9999-999999999999)
('c9c9c9c9-9999-9999-9999-999999999999', 'd1eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', '2024-03-10 13:45:00'), -- decoración
('c9c9c9c9-9999-9999-9999-999999999999', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a23', '2024-03-10 13:45:00'), -- arquitectura
('c9c9c9c9-9999-9999-9999-999999999999', 'b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a24', '2024-03-10 13:45:00'), -- juguete

-- Portalápices Dinosaurio (d0d0d0d0-aaaa-aaaa-aaaa-aaaaaaaaaaaa)
('d0d0d0d0-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', '2024-03-15 18:00:00'), -- organizador
('d0d0d0d0-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a24', '2024-03-15 18:00:00'), -- juguete
('d0d0d0d0-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'e1eebc99-9c0b-4ef83-25 13:15:00'), -- mecánico
('f2f2f2f2-cccc-cccc-cccc-cccccccccccc', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a25', '2024-03-25 13:15:00'), -- herramienta

-- Lámpara Voronoi (a3a3a3a3-dddd-dddd-dddd-dddddddddddd)
('a3a3a3a3-dddd-dddd-dddd-dddddddddddd', 'd1eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', '2024-04-01 19:30:00'), -- decoración
('a3a3a3a3-dddd-dddd-dddd-dddddddddddd', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a23', '2024-04-01 19:30:00'), -- arquitectura
('a3a3a3a3-dddd-dddd-dddd-dddddddddddd', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', '2024-04-01 19:30:00'), -- arte

-- Castillo Modular (b4b4b4b4-eeee-eeee-eeee-eeeeeeeeeeee)
('b4b4b4b4-eeee-eeee-eeee-eeeeeeeeeeee', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', '2024-04-05 10:30:00'), -- miniaturas
('b4b4b4b4-eeee-eeee-eeee-eeeeeeeeeeee', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', '2024-04-05 10:30:00'), -- dungeons-and-dragons
('b4b4b4b4-eeee-eeee-eeee-eeeeeeeeeeee', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a23', '2024-04-05 10:30:00'), -- arquitectura

-- Collar Geométrico (c5c5c5c5-ffff-ffff-ffff-ffffffffffff)
('c5c5c5c5-ffff-ffff-ffff-ffffffffffff', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', '2024-04-10 17:00:00'), -- joyería
('c5c5c5c5-ffff-ffff-ffff-ffffffffffff', 'f2eebc99-9c0b-4ef8-bb6d-6bb9bd380a28', '2024-04-10 17:00:00'), -- joyería-paramétrica
('c5c5c5c5-ffff-ffff-ffff-ffffffffffff', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a23', '2024-04-10 17:00:00'); -- arquitectura-bb6d-6bb9bd380a21', '2024-03-15 18:00:00'), -- gadget

-- Fénix Real (e1e1e1e1-bbbb-bbbb-bbbb-bbbbbbbbbbbb)
('e1e1e1e1-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2024-03-20 08:30:00'), -- dragón
('e1e1e1e1-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2024-03-20 08:30:00'), -- escultura
('e1e1e1e1-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', '2024-03-20 08:30:00'), -- arte

-- Polea Ajustable (f2f2f2f2-cccc-cccc-cccc-cccccccccccc)
('f2f2f2f2-cccc-cccc-cccc-cccccccccccc', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', '2024-03-25 13:15:00'), -- funcional
('f2f2f2f2-cccc-cccc-cccc-cccccccccccc', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', '2024-03-25 13:15:00'), -- mecánico
('f2f2f2f2-cccc-cccc-cccc-cccccccccccc', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a25', '2024-03-25 13:15:00'), -- herramienta

-- Lámpara Voronoi (a3a3a3a3-dddd-dddd-dddd-dddddddddddd)
('a3a3a3a3-dddd-dddd-dddd-dddddddddddd', 'd1eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', '2024-04-01 19:30:00'), -- decoración
('a3a3a3a3-dddd-dddd-dddd-dddddddddddd', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a23', '2024-04-01 19:30:00'), -- arquitectura
('a3a3a3a3-dddd-dddd-dddd-dddddddddddd', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', '2024-04-01 19:30:00'), -- arte

-- Castillo Modular (b4b4b4b4-eeee-eeee-eeee-eeeeeeeeeeee)
('b4b4b4b4-eeee-eeee-eeee-eeeeeeeeeeee', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', '2024-04-05 10:30:00'), -- miniaturas
('b4b4b4b4-eeee-eeee-eeee-eeeeeeeeeeee', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', '2024-04-05 10:30:00'), -- dungeons-and-dragons
('b4b4b4b4-eeee-eeee-eeee-eeeeeeeeeeee', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a23', '2024-04-05 10:30:00'), -- arquitectura

-- Collar Geométrico (c5c5c5c5-ffff-ffff-ffff-ffffffffffff)
('c5c5c5c5-ffff-ffff-ffff-ffffffffffff', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', '2024-04-10 17:00:00'), -- joyería
('c5c5c5c5-ffff-ffff-ffff-ffffffffffff', 'f2eebc99-9c0b-4ef8-bb6d-6bb9bd380a28', '2024-04-10 17:00:00'), -- joyería-paramétrica
('c5c5c5c5-ffff-ffff-ffff-ffffffffffff', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a23', '2024-04-10 17:00:00'); -- arquitectura

-- INSERT MODEL PARTS (30 registros - 2-3 partes por modelo)
INSERT INTO model_parts (id, model_id, color, part_name, file_url, file_size, created_at) VALUES
-- Dragón Esmeralda (a1a1a1a1-1111-1111-1111-111111111111)
(gen_random_uuid(), 'a1a1a1a1-1111-1111-1111-111111111111', '#00FF00', 'Cuerpo del Dragón', 'https://storage.com/parts/dragon-cuerpo.stl', 15728640, '2024-01-15 10:35:00'),
(gen_random_uuid(), 'a1a1a1a1-1111-1111-1111-111111111111', '#00DD00', 'Alas (par)', 'https://storage.com/parts/dragon-alas.stl', 10485760, '2024-01-15 10:35:00'),
(gen_random_uuid(), 'a1a1a1a1-1111-1111-1111-111111111111', '#AAFFAA', 'Cabeza', 'https://storage.com/parts/dragon-cabeza.stl', 8388608, '2024-01-15 10:35:00'),

-- Engranaje Planetario (b2b2b2b2-2222-2222-2222-222222222222)
(gen_random_uuid(), 'b2b2b2b2-2222-2222-2222-222222222222', '#FF0000', 'Engranaje central', 'https://storage.com/parts/engranaje-central.stl', 5242880, '2024-01-20 15:50:00'),
(gen_random_uuid(), 'b2b2b2b2-2222-2222-2222-222222222222', '#DD0000', 'Engranajes satélite (x3)', 'https://storage.com/parts/engranaje-satelite.stl', 3145728, '2024-01-20 15:50:00'),
(gen_random_uuid(), 'b2b2b2b2-2222-2222-2222-222222222222', '#BB0000', 'Soporte y anillo exterior', 'https://storage.com/parts/engranaje-soporte.stl', 2097152, '2024-01-20 15:50:00'),

-- Vaso Paramétrico (c3c3c3c3-3333-3333-3333-333333333333)
(gen_random_uuid(), 'c3c3c3c3-3333-3333-3333-333333333333', '#3366FF', 'Cuerpo principal', 'https://storage.com/parts/vaso-cuerpo.stl', 10485760, '2024-02-01 09:20:00'),
(gen_random_uuid(), 'c3c3c3c3-3333-3333-3333-333333333333', '#2255EE', 'Base', 'https://storage.com/parts/vaso-base.stl', 4194304, '2024-02-01 09:20:00'),

-- Guerrero Élfico (d4d4d4d4-4444-4444-4444-444444444444)
(gen_random_uuid(), 'd4d4d4d4-4444-4444-4444-444444444444', '#FFAA00', 'Cuerpo con armadura', 'https://storage.com/parts/elfo-cuerpo.stl', 12582912, '2024-02-10 12:05:00'),
(gen_random_uuid(), 'd4d4d4d4-4444-4444-4444-444444444444', '#FFCC00', 'Cabeza con casco', 'https://storage.com/parts/elfo-cabeza.stl', 5242880, '2024-02-10 12:05:00'),
(gen_random_uuid(), 'd4d4d4d4-4444-4444-4444-444444444444', '#DDAA00', 'Armas (espada y escudo)', 'https://storage.com/parts/elfo-armas.stl', 3145728, '2024-02-10 12:05:00'),

-- Anillo Dragón (e5e5e5e5-5555-5555-5555-555555555555)
(gen_random_uuid(), 'e5e5e5e5-5555-5555-5555-555555555555', '#FFD700', 'Aro del anillo', 'https://storage.com/parts/anillo-aro.stl', 2097152, '2024-02-15 16:25:00'),
(gen_random_uuid(), 'e5e5e5e5-5555-5555-5555-555555555555', '#FFAA00', 'Dragón decorativo', 'https://storage.com/parts/anillo-dragon.stl', 4194304, '2024-02-15 16:25:00'),

-- Soporte Modular (f6f6f6f6-6666-6666-6666-666666666666)
(gen_random_uuid(), 'f6f6f6f6-6666-6666-6666-666666666666', '#888888', 'Base principal', 'https://storage.com/parts/soporte-base.stl', 8388608, '2024-02-20 11:35:00'),
(gen_random_uuid(), 'f6f6f6f6-6666-6666-6666-666666666666', '#666666', 'Módulo A (estante)', 'https://storage.com/parts/soporte-modulo-a.stl', 5242880, '2024-02-20 11:35:00'),
(gen_random_uuid(), 'f6f6f6f6-6666-6666-6666-666666666666', '#444444', 'Módulo B (cajón)', 'https://storage.com/parts/soporte-modulo-b.stl', 5242880, '2024-02-20 11:35:00'),

-- Criatura Lovecraftiana (a7a7a7a7-7777-7777-7777-777777777777)
(gen_random_uuid(), 'a7a7a7a7-7777-7777-7777-777777777777', '#440044', 'Cuerpo principal', 'https://storage.com/parts/lovecraft-cuerpo.stl', 18874368, '2024-03-01 14:05:00'),
(gen_random_uuid(), 'a7a7a7a7-7777-7777-7777-777777777777', '#330033', 'Tentáculos', 'https://storage.com/parts/lovecraft-tentaculos.stl', 12582912, '2024-03-01 14:05:00'),
(gen_random_uuid(), 'a7a7a7a7-7777-7777-7777-777777777777', '#220022', 'Base', 'https://storage.com/parts/lovecraft-base.stl', 6291456, '2024-03-01 14:05:00'),

-- Caja Engranajes (b8b8b8b8-8888-8888-8888-888888888888)
(gen_random_uuid(), 'b8b8b8b8-8888-8888-8888-888888888888', '#FF6600', 'Cuerpo de la caja', 'https://storage.com/parts/caja-cuerpo.stl', 7340032, '2024-03-05 10:50:00'),
(gen_random_uuid(), 'b8b8b8b8-8888-8888-8888-888888888888', '#DD4400', 'Tapa con engranajes', 'https://storage.com/parts/caja-tapa.stl', 4194304, '2024-03-05 10:50:00'),

-- Maceta Geométrica (c9c9c9c9-9999-9999-9999-999999999999)
(gen_random_uuid(), 'c9c9c9c9-9999-9999-9999-999999999999', '#99CC00', 'Maceta', 'https://storage.com/parts/maceta-cuerpo.stl', 10485760, '2024-03-10 13:20:00'),
(gen_random_uuid(), 'c9c9c9c9-9999-9999-9999-999999999999', '#88BB00', 'Plato', 'https://storage.com/parts/maceta-plato.stl', 3145728, '2024-03-10 13:20:00'),

-- Portalápices Dinosaurio (d0d0d0d0-aaaa-aaaa-aaaa-aaaaaaaaaaaa)
(gen_random_uuid(), 'd0d0d0d0-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '#663300', 'Cuerpo del dinosaurio', 'https://storage.com/parts/dino-cuerpo.stl', 6291456, '2024-03-15 17:35:00'),
(gen_random_uuid(), 'd0d0d0d0-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '#552200', 'Portalápices (espalda)', 'https://storage.com/parts/dino-portalapices.stl', 4194304, '2024-03-15 17:35:00'),

-- Fénix Real (e1e1e1e1-bbbb-bbbb-bbbb-bbbbbbbbbbbb)
(gen_random_uuid(), 'e1e1e1e1-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '#FF5500', 'Cuerpo', 'https://storage.com/parts/fenix-cuerpo.stl', 14680064, '2024-03-20 08:05:00'),
(gen_random_uuid(), 'e1e1e1e1-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '#FF3300', 'Alas', 'https://storage.com/parts/fenix-alas.stl', 10485760, '2024-03-20 08:05:00'),
(gen_random_uuid(), 'e1e1e1e1-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '#FF2200', 'Cola', 'https://storage.com/parts/fenix-cola.stl', 7340032, '2024-03-20 08:05:00'),

-- Polea Ajustable (f2f2f2f2-cccc-cccc-cccc-cccccccccccc)
(gen_random_uuid(), 'f2f2f2f2-cccc-cccc-cccc-cccccccccccc', '#CCCCCC', 'Cuerpo de polea', 'https://storage.com/parts/polea-cuerpo.stl', 5242880, '2024-03-25 12:50:00'),
(gen_random_uuid(), 'f2f2f2f2-cccc-cccc-cccc-cccccccccccc', '#AAAAAA', 'Rodamiento', 'https://storage.com/parts/polea-rodamiento.stl', 2097152, '2024-03-25 12:50:00'),

-- Lámpara Voronoi (a3a3a3a3-dddd-dddd-dddd-dddddddddddd)
(gen_random_uuid(), 'a3a3a3a3-dddd-dddd-dddd-dddddddddddd', '#FFFFAA', 'Pantalla Voronoi', 'https://storage.com/parts/lampara-pantalla.stl', 12582912, '2024-04-01 19:05:00'),
(gen_random_uuid(), 'a3a3a3a3-dddd-dddd-dddd-dddddddddddd', '#FFEE99', 'Base', 'https://storage.com/parts/lampara-base.stl', 5242880, '2024-04-01 19:05:00'),

-- Castillo Modular (b4b4b4b4-eeee-eeee-eeee-eeeeeeeeeeee)
(gen_random_uuid(), 'b4b4b4b4-eeee-eeee-eeee-eeeeeeeeeeee', '#AA8866', 'Torre principal', 'https://storage.com/parts/castillo-torre.stl', 10485760, '2024-04-05 10:05:00'),
(gen_random_uuid(), 'b4b4b4b4-eeee-eeee-eeee-eeeeeeeeeeee', '#997755', 'Muralla', 'https://storage.com/parts/castillo-muralla.stl', 8388608, '2024-04-05 10:05:00'),
(gen_random_uuid(), 'b4b4b4b4-eeee-eeee-eeee-eeeeeeeeeeee', '#886644', 'Puerta', 'https://storage.com/parts/castillo-puerta.stl', 4194304, '2024-04-05 10:05:00'),

-- Collar Geométrico (c5c5c5c5-ffff-ffff-ffff-ffffffffffff)
(gen_random_uuid(), 'c5c5c5c5-ffff-ffff-ffff-ffffffffffff', '#C0C0C0', 'Pieza central', 'https://storage.com/parts/collar-central.stl', 2097152, '2024-04-10 16:35:00'),
(gen_random_uuid(), 'c5c5c5c5-ffff-ffff-ffff-ffffffffffff', '#A0A0A0', 'Cadena', 'https://storage.com/parts/collar-cadena.stl', 1572864, '2024-04-10 16:35:00'),
(gen_random_uuid(), 'c5c5c5c5-ffff-ffff-ffff-ffffffffffff', '#808080', 'Cierre', 'https://storage.com/parts/collar-cierre.stl', 1048576, '2024-04-10 16:35:00');