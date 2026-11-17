package com.eagledev.backend.infrastructure.adapter.out.persistence.repository;

import com.eagledev.backend.infrastructure.adapter.out.persistence.entity.CategoriaJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SpringDataCategoriaRepository extends JpaRepository<CategoriaJpaEntity, Long> {

    Optional<CategoriaJpaEntity> findByNombre(String nombre);
}
