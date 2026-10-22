-- Restart-safe DDL. MySQL DDL auto-commits; never modify an applied migration.
SET @statement = IF((SELECT COUNT(*) FROM information_schema.statistics WHERE table_schema = DATABASE() AND table_name = 'animal' AND index_name = 'idx_animal_estado_creado') = 0, 'CREATE INDEX idx_animal_estado_creado ON animal (estado, creado)', 'SELECT 1');
PREPARE stmt FROM @statement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @statement = IF((SELECT COUNT(*) FROM information_schema.statistics WHERE table_schema = DATABASE() AND table_name = 'peticion' AND index_name = 'idx_peticion_usuario_estado') = 0, 'CREATE INDEX idx_peticion_usuario_estado ON peticion (usuario_id, estado)', 'SELECT 1');
PREPARE stmt FROM @statement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
