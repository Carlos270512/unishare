package com.eagledev.backend.application.port.out;

import com.eagledev.backend.domain.model.Persona;

import java.util.Optional;

public interface PersonaRepositoryPort {

    boolean existsByCedula(String cedula);

    boolean existsByEmail(String email);

    Optional<Persona> findByCedula(String cedula);

    Optional<Persona> findById(Long id);

    Persona save(Persona persona);
}
