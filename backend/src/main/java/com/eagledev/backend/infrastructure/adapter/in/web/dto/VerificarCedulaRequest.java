package com.eagledev.backend.infrastructure.adapter.in.web.dto;

import jakarta.validation.constraints.NotBlank;

public record VerificarCedulaRequest(@NotBlank String cedula) {
}
