CREATE TABLE productos (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    titulo VARCHAR(160) NOT NULL,
    descripcion TEXT NOT NULL,
    modalidad ENUM('DONACION','PRESTAMO') NOT NULL DEFAULT 'DONACION',
    categoria_id BIGINT UNSIGNED NOT NULL,
    imagen_url VARCHAR(255) NULL,
    persona_id BIGINT UNSIGNED NOT NULL,
    estado ENUM('DISPONIBLE','SOLICITADO','ENTREGADO') NOT NULL DEFAULT 'DISPONIBLE',
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_productos_categoria (categoria_id),
    KEY idx_productos_creado (creado_en),
    CONSTRAINT fk_productos_categoria FOREIGN KEY (categoria_id) REFERENCES categorias (id),
    CONSTRAINT fk_productos_persona FOREIGN KEY (persona_id) REFERENCES personas (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE solicitudes (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    producto_id BIGINT UNSIGNED NOT NULL,
    solicitante_persona_id BIGINT UNSIGNED NOT NULL,
    mensaje VARCHAR(500) NULL,
    estado ENUM('PENDIENTE','APROBADA','RECHAZADA','ENTREGADA') NOT NULL DEFAULT 'PENDIENTE',
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    respondida_en TIMESTAMP NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_solicitud_producto_persona (producto_id, solicitante_persona_id),
    CONSTRAINT fk_solicitudes_producto FOREIGN KEY (producto_id) REFERENCES productos (id),
    CONSTRAINT fk_solicitudes_persona FOREIGN KEY (solicitante_persona_id) REFERENCES personas (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
