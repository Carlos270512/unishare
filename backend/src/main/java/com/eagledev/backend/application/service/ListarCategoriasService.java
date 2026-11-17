package com.eagledev.backend.application.service;

import com.eagledev.backend.application.port.in.ListarCategoriasUseCase;
import com.eagledev.backend.application.port.out.CategoriaRepositoryPort;
import com.eagledev.backend.domain.model.Categoria;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ListarCategoriasService implements ListarCategoriasUseCase {

    private final CategoriaRepositoryPort categoriaRepository;

    public ListarCategoriasService(CategoriaRepositoryPort categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    @Override
    public List<Categoria> listar() {
        return categoriaRepository.findAll();
    }
}
