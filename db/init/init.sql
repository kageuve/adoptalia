CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    rol VARCHAR(50) NOT NULL
);

INSERT INTO usuarios (nombre, rol) VALUES 
('delo', 'Administrador'),
('sonia','Administrador'),
('fran','Administrador'),
('jose','Administrador'),
('dani', 'Administrador'),
('pedro','Usuario');
