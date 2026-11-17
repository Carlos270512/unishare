package com.eagledev.backend.infrastructure.adapter.in.web.dto;

import com.eagledev.backend.domain.model.DatosCedula;

public record DatosCedulaResponse(String cedula, String nombres, String apellidos, String nombreCompleto) {

    public static DatosCedulaResponse from(DatosCedula datos) {
        return new DatosCedulaResponse(
                datos.cedula(),
                datos.nombres(),
                datos.apellidos(),
                datos.nombreCompleto());
    }
}
