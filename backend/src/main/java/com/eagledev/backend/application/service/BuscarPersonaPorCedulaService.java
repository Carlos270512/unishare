package com.eagledev.backend.application.service;

import com.eagledev.backend.application.port.in.BuscarPersonaPorCedulaUseCase;
import com.eagledev.backend.application.port.out.PersonaRepositoryPort;
import com.eagledev.backend.domain.model.Persona;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class BuscarPersonaPorCedulaService implements BuscarPersonaPorCedulaUseCase {

    private final PersonaRepositoryPort personaRepository;

    public BuscarPersonaPorCedulaService(PersonaRepositoryPort personaRepository) {
        this.personaRepository = personaRepository;
    }

    @Override
    public Optional<Persona> buscar(String cedula) {
        return personaRepository.findByCedula(cedula);
    }
}
