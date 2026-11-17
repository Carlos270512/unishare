package com.eagledev.backend.domain.model;

import java.time.LocalDateTime;

public record Usuario(
        Long id,
        Long personaId,
        String email,
        String password,
        Rol rol,
        boolean activo,
        LocalDateTime creadoEn) {
}
