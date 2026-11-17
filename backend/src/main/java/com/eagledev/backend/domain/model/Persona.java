package com.eagledev.backend.domain.model;

import java.time.LocalDateTime;

public record Persona(
        Long id,
        String cedula,
        String nombres,
        String apellidos,
        String nombreCompleto,
        String email,
        String telefono,
        String fotoUrl,
        LocalDateTime creadoEn) {
}
