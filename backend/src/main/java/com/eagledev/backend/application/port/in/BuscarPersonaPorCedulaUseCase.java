package com.eagledev.backend.application.port.in;

import com.eagledev.backend.domain.model.Persona;

import java.util.Optional;

public interface BuscarPersonaPorCedulaUseCase {

    Optional<Persona> buscar(String cedula);
}
