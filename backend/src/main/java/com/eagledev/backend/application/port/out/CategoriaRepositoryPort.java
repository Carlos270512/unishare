package com.eagledev.backend.application.port.out;

import com.eagledev.backend.domain.model.Categoria;

import java.util.List;
import java.util.Optional;

public interface CategoriaRepositoryPort {

    List<Categoria> findAll();

    Optional<Categoria> findById(Long id);

    Optional<Categoria> findByNombre(String nombre);
}
