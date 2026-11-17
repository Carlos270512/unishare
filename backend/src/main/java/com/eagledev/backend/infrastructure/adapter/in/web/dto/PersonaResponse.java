package com.eagledev.backend.infrastructure.adapter.in.web.dto;

import com.eagledev.backend.domain.model.Persona;

public record PersonaResponse(
        Long id,
        String cedula,
        String nombreCompleto,
        String email,
        String fotoUrl) {

    public static PersonaResponse from(Persona persona) {
        return new PersonaResponse(
                persona.id(),
                persona.cedula(),
                persona.nombreCompleto(),
                persona.email(),
                persona.fotoUrl());
    }
}
