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
(1, 'protectora1@test.com', '$2b$10$nDLfip602oYTIb9/HyLTy.oiHGtIP1xBJaTgcUFxg/4VlsY7VYply', 'protectora'),
(3, 'usuario1@test.com', '$2b$10$wcOGlnmbO4vuGkoZ/73.ROvxx1jvRaZK/wsVYptwMnIjtcZkgGfay', 'usuario'),
(4, 'usuario2@test.com', '$2b$10$QekmjJI3X3GoH325ViMmL.F7JA3FBzocgMheyYjL7.wvI5XHfNcH6', 'usuario'),
(6, 'protectora2@test.com', '$2b$10$bji5PScI1enpq4pthXl/Z.vhRsgYYLvBL80.c23c6J9sGga2qbX5u', 'protectora');

-- ======================
-- TABLA PROTECTORA
-- ======================

CREATE TABLE protectora (
  id INT NOT NULL AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  nombre VARCHAR(150) NOT NULL,
  cif VARCHAR(20) NOT NULL,
  ciudad VARCHAR(100) NOT NULL,
  direccion VARCHAR(255),
  latitud DECIMAL(10,8),
  longitud DECIMAL(11,8),
  web VARCHAR(255),
  descripcion TEXT,
  verificado TINYINT(1) DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY usuario_id (usuario_id),
  UNIQUE KEY cif (cif),
  CONSTRAINT fk_protectora_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

INSERT INTO protectora (id, usuario_id, nombre, cif, ciudad, verificado) VALUES
(1, 1, 'Adopta no compres', 'B12345678', 'Madrid', 1),
(6, 6, 'Aristogatos', 'B87654321', 'Bilbao', 1);

-- ======================
-- TABLA ANIMAL
-- ======================

CREATE TABLE animal (
  id INT NOT NULL AUTO_INCREMENT,
  protectora_id INT NOT NULL,
  local_id VARCHAR(100),
  nombre VARCHAR(100) NOT NULL,
  tipo ENUM('perro','gato','otro') NOT NULL,
  especie VARCHAR(100),
  genero ENUM('macho','hembra') NOT NULL,
  tamano ENUM('pequeño','mediano','grande') NOT NULL,
  fecha_nacimiento DATE,
  descripcion TEXT,
  chip VARCHAR(50),
  estado ENUM('disponible','reservado','adoptado') DEFAULT 'disponible',
  creado TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY fk_animal_protectora (protectora_id),
  CONSTRAINT fk_animal_protectora
    FOREIGN KEY (protectora_id) REFERENCES protectora(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

INSERT INTO animal (id, protectora_id, nombre, tipo, genero, tamano, estado) VALUES
(26, 1, 'Luna', 'perro', 'hembra', 'grande', 'disponible'),
(27, 1, 'Max', 'perro', 'macho', 'mediano', 'disponible'),
(28, 6, 'Thor', 'perro', 'macho', 'grande', 'disponible'),
(30, 6, 'Misu', 'gato', 'hembra', 'pequeño', 'disponible'),
(31, 6, 'Rocky', 'perro', 'macho', 'mediano', 'reservado');

-- ======================
-- TABLA MEDIA
-- ======================

CREATE TABLE media (
  id INT NOT NULL AUTO_INCREMENT,
  animal_id INT NOT NULL,
  url VARCHAR(255) NOT NULL,
  principal TINYINT(1) DEFAULT 0,
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
  mensaje TEXT,
  estado ENUM('pendiente','aprobada','rechazada') DEFAULT 'pendiente',
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
