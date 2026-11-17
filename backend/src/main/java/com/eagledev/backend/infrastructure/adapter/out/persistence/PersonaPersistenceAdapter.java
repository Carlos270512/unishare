package com.eagledev.backend.infrastructure.adapter.out.persistence;

import com.eagledev.backend.application.port.out.PersonaRepositoryPort;
import com.eagledev.backend.domain.model.Persona;
import com.eagledev.backend.infrastructure.adapter.out.persistence.entity.PersonaJpaEntity;
import com.eagledev.backend.infrastructure.adapter.out.persistence.repository.SpringDataPersonaRepository;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Optional;

@Component
public class PersonaPersistenceAdapter implements PersonaRepositoryPort {

    private final SpringDataPersonaRepository repository;

    public PersonaPersistenceAdapter(SpringDataPersonaRepository repository) {
        this.repository = repository;
    }

    @Override
    public boolean existsByCedula(String cedula) {
        return repository.existsByCedula(cedula);
    }

    @Override
    public boolean existsByEmail(String email) {
        return repository.existsByEmail(email);
    }

    @Override
    public Optional<Persona> findByCedula(String cedula) {
        return repository.findByCedula(cedula).map(this::toDomain);
    }

    @Override
    public Optional<Persona> findById(Long id) {
        return repository.findById(id).map(this::toDomain);
    }

    @Override
    public Persona save(Persona persona) {
        PersonaJpaEntity entity = new PersonaJpaEntity();
        entity.setCedula(persona.cedula());
        entity.setNombres(persona.nombres());
        entity.setApellidos(persona.apellidos());
        entity.setNombreCompleto(persona.nombreCompleto());
        entity.setEmail(persona.email());
        entity.setTelefono(persona.telefono());
        entity.setFotoUrl(persona.fotoUrl());
        entity.setCreadoEn(LocalDateTime.now());
        return toDomain(repository.save(entity));
    }

    private Persona toDomain(PersonaJpaEntity entity) {
        return new Persona(
                entity.getId(),
                entity.getCedula(),
                entity.getNombres(),
                entity.getApellidos(),
                entity.getNombreCompleto(),
                entity.getEmail(),
                entity.getTelefono(),
                entity.getFotoUrl(),
                entity.getCreadoEn());
    }
}
