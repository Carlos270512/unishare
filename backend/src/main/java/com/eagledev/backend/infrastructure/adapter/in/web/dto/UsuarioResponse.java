package com.eagledev.backend.infrastructure.adapter.in.web.dto;

import com.eagledev.backend.domain.model.Usuario;

public record UsuarioResponse(Long id, Long personaId, String email, String rol) {

    public static UsuarioResponse from(Usuario usuario) {
        return new UsuarioResponse(
                usuario.id(),
                usuario.personaId(),
                usuario.email(),
                usuario.rol().name());
    }
}
