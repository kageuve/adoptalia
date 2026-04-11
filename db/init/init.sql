DROP DATABASE IF EXISTS adoptalia;
CREATE DATABASE adoptalia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE adoptalia;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;

-- ======================
-- TABLA USUARIO
-- ======================

CREATE TABLE usuario (
  id INT NOT NULL AUTO_INCREMENT,
  email VARCHAR(150) NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol ENUM('administrador','protectora','usuario') NOT NULL,
  creado TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY email (email)
) ENGINE=InnoDB;

INSERT INTO usuario (id, email, password, rol) VALUES
(3, 'test@correo.com', '$2b$10$wcOGlnmbO4vuGkoZ/73.ROvxx1jvRaZK/wsVYptwMnIjtcZkgGfay', 'usuario'),
(4, 'pacoFoc@correo.com', '$2b$10$QekmjJI3X3GoH325ViMmL.F7JA3FBzocgMheyYjL7.wvI5XHfNcH6', 'usuario'),
(5, 'info@huellasfelices.org', '$2b$10$nDLfip602oYTIb9/HyLTy.oiHGtIP1xBJaTgcUFxg/4VlsY7VYply', 'protectora'),
(6, 'contacto@patitas.org', '$2b$10$nDLfip602oYTIb9/HyLTy.oiHGtIP1xBJaTgcUFxg/4VlsY7VYply', 'protectora'),
(7, 'hola@animallove.org', '$2b$10$nDLfip602oYTIb9/HyLTy.oiHGtIP1xBJaTgcUFxg/4VlsY7VYply', 'protectora'),
(8, 'info@esperanzaanimal.org', '$2b$10$nDLfip602oYTIb9/HyLTy.oiHGtIP1xBJaTgcUFxg/4VlsY7VYply', 'protectora'),
(9, 'contacto@panorte.org', '$2b$10$nDLfip602oYTIb9/HyLTy.oiHGtIP1xBJaTgcUFxg/4VlsY7VYply', 'protectora');

-- ======================
-- TABLA PROTECTORA
-- ======================

CREATE TABLE protectora (
  id INT NOT NULL AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  nombre VARCHAR(150) NOT NULL,
  cif VARCHAR(20) NOT NULL,
  ciudad VARCHAR(100) NOT NULL,
  direccion VARCHAR(255) NULL DEFAULT NULL,
  latitud DECIMAL(10,8) NULL DEFAULT NULL,
  longitud DECIMAL(11,8) NULL DEFAULT NULL,
  web VARCHAR(255) NULL DEFAULT NULL,
  descripcion TEXT NULL DEFAULT NULL,
  telefono VARCHAR(20) NULL DEFAULT NULL,
  email VARCHAR(150) NULL DEFAULT NULL,
  imagen TEXT NULL DEFAULT NULL,
  verificado TINYINT(1) NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY usuario_id (usuario_id),
  UNIQUE KEY cif (cif),
  CONSTRAINT fk_protectora_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

INSERT INTO protectora (id, usuario_id, nombre, cif, ciudad, descripcion, telefono, email, imagen, verificado) VALUES
(6, 5, 'Protectora Huellas Felices', 'B11111111', 'Madrid', 'Rescatamos y cuidamos perros y gatos abandonados, buscando un hogar responsable.', '600 123 456', 'info@huellasfelices.org', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhDafiH5F_w1gYCrdhK3ptNyiEG2L0GPQQPQ&s', 1),
(7, 6, 'Refugio Patitas', 'B22222222', 'Barcelona', 'Centro de acogida especializado en animales en situación de abandono.', '611 234 567', 'contacto@patitas.org', 'https://www.shutterstock.com/image-photo/dog-shelter-animal-volunteer-takes-260nw-2467677723.jpg', 1),
(8, 7, 'Asociación Animal Love', 'B33333333', 'Valencia', 'Promovemos la adopción responsable y el bienestar animal.', '622 345 678', 'hola@animallove.org', 'https://res.cloudinary.com/worldpackers/image/upload/c_fill,f_auto,q_auto,w_1024/v1/guides/article_cover/wesauslaoz5kkprwrkjg?_a=BACAGSGT', 1),
(9, 8, 'Refugio Esperanza Animal', 'B44444444', 'Sevilla', 'Damos una segunda oportunidad a animales rescatados.', '633 456 789', 'info@esperanzaanimal.org', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbPkcFNuvn6_eIPm_MKRB1oBvbfpN4ajwLyQ&s', 1),
(10, 9, 'Protección Animal Norte', 'B55555555', 'Bilbao', 'Refugio comprometido con el rescate y adopción de animales.', '644 567 890', 'contacto@panorte.org', 'https://mivet.com/wp-content/uploads/fly-images/912/Foto-Post-16-740x510-c.jpg', 1);

-- ======================
-- TABLA ANIMAL
-- ======================

CREATE TABLE animal (
  id INT NOT NULL AUTO_INCREMENT,
  protectora_id INT NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  especie ENUM('perro','gato') NOT NULL,
  raza VARCHAR(100) NULL DEFAULT NULL,
  genero ENUM('macho','hembra') NOT NULL,
  tamano ENUM('pequeño','mediano','grande') NOT NULL,
  fecha_nacimiento DATE NULL DEFAULT NULL,
  descripcion TEXT NULL DEFAULT NULL,
  chip VARCHAR(50) NULL DEFAULT NULL,
  estado ENUM('disponible','reservado','adoptado') NULL DEFAULT 'disponible',
  creado TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  imagen_url TEXT NULL DEFAULT NULL,
  PRIMARY KEY (id),
  KEY fk_animal_protectora (protectora_id),
  CONSTRAINT fk_animal_protectora
    FOREIGN KEY (protectora_id) REFERENCES protectora(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

INSERT INTO animal (protectora_id, nombre, especie, raza, genero, tamano, fecha_nacimiento, estado, imagen_url) VALUES
(6, 'Luna', 'perro', 'Labrador', 'hembra', 'grande', '2022-01-01', 'disponible', 'https://cdn-ilcmkfh.nitrocdn.com/yyMhcicvwELNLGXsIkJPkrkfmvWjNMQC/assets/images/optimized/rev-7cbf74f/labradoresdeabantueso.com/wp-content/uploads/2013/07/Jara-9-tocada.jpg'),
(7, 'Max', 'perro', 'Pastor Alemán', 'macho', 'grande', '2020-01-01', 'disponible', 'https://www.aon.es/personales/seguro-perro-gato/wp-content/uploads/sites/2/2021/06/pastor-aleman-3.jpg'),
(8, 'Nala', 'gato', 'Siamés', 'hembra', 'pequeño', '2023-01-01', 'disponible', 'https://www.purina.es/sites/default/files/styles/ttt_image_510/public/2024-02/sitesdefaultfilesstylessquare_medium_440x440public2022-06Siamese201.jpg?itok=j9A2IvjN'),
(9, 'Rocky', 'perro', 'Bulldog', 'macho', 'mediano', '2021-01-01', 'disponible', 'https://cdn.wamiz.fr/cdn-cgi/image/format=auto,quality=80,width=720,height=405,fit=cover/animal/breed/dog/adult/668664f3a41f4810812457.jpg'),
(6, 'Mia', 'gato', 'Persa', 'hembra', 'pequeño', '2024-01-01', 'disponible', 'https://service.mascotas.com/revista/Revista_63c05db2cd9d2_12012023.jpg?raw=1'),
(10, 'Thor', 'perro', 'Husky', 'macho', 'grande', '2022-01-01', 'disponible', 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Siberian_Husky_-_Mika.jpg'),
(8, 'Simba', 'gato', 'Común Europeo', 'macho', 'pequeño', '2023-01-01', 'disponible', 'https://content.elmueble.com/medio/2022/06/07/gato-erik-jan-leusink-ibpxglgjimi-unsplash_21d35523_1280x853.jpg'),
(6, 'Kira', 'perro', 'Border Collie', 'hembra', 'mediano', '2024-01-01', 'disponible', 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Argentine_border_collie.jpg'),
(7, 'Leo', 'gato', 'Maine Coon', 'macho', 'mediano', '2021-01-01', 'disponible', 'https://static.wixstatic.com/media/2b6761_e1b03cf129f4472a8dd5997f55ba31dc~mv2.jpg/v1/fill/w_640,h_588,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/2b6761_e1b03cf129f4472a8dd5997f55ba31dc~mv2.jpg'),
(8, 'Bruno', 'perro', 'Golden Retriever', 'macho', 'grande', '2019-01-01', 'disponible', 'https://www.zoomalia.com/blogz/4850/tout-savoir-sur-golden-retriever.jpeg');

-- ======================
-- TABLA MEDIA
-- ======================

CREATE TABLE media (
  id INT NOT NULL AUTO_INCREMENT,
  animal_id INT NOT NULL,
  url VARCHAR(255) NOT NULL,
  principal TINYINT(1) NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY fk_media_animal (animal_id),
  CONSTRAINT fk_media_animal
    FOREIGN KEY (animal_id) REFERENCES animal(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ======================
-- TABLA PETICION
-- ======================

CREATE TABLE peticion (
  id INT NOT NULL AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  animal_id INT NOT NULL,
  mensaje TEXT NULL DEFAULT NULL,
  estado ENUM('pendiente','aprobada','rechazada') NULL DEFAULT 'pendiente',
  creado TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY fk_peticion_usuario (usuario_id),
  KEY fk_peticion_animal (animal_id),
  CONSTRAINT fk_peticion_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_peticion_animal
    FOREIGN KEY (animal_id) REFERENCES animal(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

COMMIT;