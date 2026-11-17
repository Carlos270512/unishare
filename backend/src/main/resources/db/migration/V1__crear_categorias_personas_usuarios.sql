CREATE TABLE categorias (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(60) NOT NULL,
    activo TINYINT(1) NOT NULL DEFAULT 1,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_categorias_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE personas (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    cedula VARCHAR(20) NOT NULL,
    nombres VARCHAR(120) NOT NULL,
    apellidos VARCHAR(120) NOT NULL,
    nombre_completo VARCHAR(240) NOT NULL,
    email VARCHAR(160) NOT NULL,
    telefono VARCHAR(20) NULL,
    foto_url VARCHAR(255) NULL,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_personas_cedula (cedula),
    UNIQUE KEY uk_personas_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE usuarios (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    persona_id BIGINT UNSIGNED NOT NULL,
    email VARCHAR(160) NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('ESTUDIANTE','ADMINISTRADOR') NOT NULL DEFAULT 'ESTUDIANTE',
    activo TINYINT(1) NOT NULL DEFAULT 1,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_usuarios_email (email),
    UNIQUE KEY uk_usuarios_persona (persona_id),
    CONSTRAINT fk_usuarios_persona FOREIGN KEY (persona_id) REFERENCES personas (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO categorias (nombre) VALUES
('Libros'),
('Tecnología'),
('Laboratorio'),
('Otro');
