package com.eagledev.backend.infrastructure.adapter.in.web.dto;

import com.eagledev.backend.domain.model.Categoria;

public record CategoriaResponse(Long id, String nombre) {

    public static CategoriaResponse from(Categoria categoria) {
        return new CategoriaResponse(categoria.id(), categoria.nombre());
    }
}
