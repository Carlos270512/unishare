package com.eagledev.backend.application.port.out;

import com.eagledev.backend.domain.model.DatosCedula;

import java.util.Optional;

public interface CedulaVerificationPort {

    Optional<DatosCedula> consultar(String cedula);
}
