package com.eagledev.backend.infrastructure.adapter.in.web.dto;

import com.eagledev.backend.domain.model.Producto;

import java.time.LocalDateTime;

public record ProductoResponse(
        Long id,
        String titulo,
        String descripcion,
        String modalidad,
        Long categoriaId,
        String categoriaNombre,
        String imagenUrl,
        Long personaId,
        String personaEmail,
        String personaNombre,
        String estado,
        LocalDateTime creadoEn) {

    public static ProductoResponse from(Producto producto) {
        String imagenUrl = producto.imagenUrl() == null
                ? null
                : "/api/uploads/" + producto.imagenUrl();

        return new ProductoResponse(
                producto.id(),
                producto.titulo(),
                producto.descripcion(),
                producto.modalidad().name(),
                producto.categoriaId(),
                producto.categoriaNombre(),
                imagenUrl,
                producto.personaId(),
                producto.personaEmail(),
                producto.personaNombre(),
                producto.estado().name(),
                producto.creadoEn());
    }
}
