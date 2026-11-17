package com.eagledev.backend.application.port.in;

import com.eagledev.backend.domain.model.DatosCedula;

public interface VerificarCedulaUseCase {

    DatosCedula verificar(String cedula);
}
