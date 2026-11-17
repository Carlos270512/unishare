package com.eagledev.backend.infrastructure.adapter.out.persistence.repository;

import com.eagledev.backend.infrastructure.adapter.out.persistence.entity.PersonaJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SpringDataPersonaRepository extends JpaRepository<PersonaJpaEntity, Long> {

    boolean existsByCedula(String cedula);

    boolean existsByEmail(String email);

    Optional<PersonaJpaEntity> findByCedula(String cedula);
}
