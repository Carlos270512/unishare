package com.eagledev.backend.infrastructure.adapter.out.persistence;

import com.eagledev.backend.application.port.out.CategoriaRepositoryPort;
import com.eagledev.backend.domain.model.Categoria;
import com.eagledev.backend.infrastructure.adapter.out.persistence.entity.CategoriaJpaEntity;
import com.eagledev.backend.infrastructure.adapter.out.persistence.repository.SpringDataCategoriaRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class CategoriaPersistenceAdapter implements CategoriaRepositoryPort {

    private final SpringDataCategoriaRepository repository;

    public CategoriaPersistenceAdapter(SpringDataCategoriaRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Categoria> findAll() {
        return repository.findAll().stream().map(this::toDomain).toList();
    }

    @Override
    public Optional<Categoria> findById(Long id) {
        return repository.findById(id).map(this::toDomain);
    }

    @Override
    public Optional<Categoria> findByNombre(String nombre) {
        return repository.findByNombre(nombre).map(this::toDomain);
    }

    private Categoria toDomain(CategoriaJpaEntity entity) {
        return new Categoria(entity.getId(), entity.getNombre(), entity.isActivo());
    }
}
