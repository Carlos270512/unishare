package com.eagledev.backend.domain.model;

import java.time.LocalDateTime;

public record Producto(
        Long id,
        String titulo,
        String descripcion,
        Modalidad modalidad,
        Long categoriaId,
        String categoriaNombre,
        String imagenUrl,
        Long personaId,
        String personaEmail,
        String personaNombre,
        EstadoProducto estado,
        LocalDateTime creadoEn) {
}
