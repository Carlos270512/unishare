package com.eagledev.backend.application.port.in;

import com.eagledev.backend.domain.model.Categoria;

import java.util.List;

public interface ListarCategoriasUseCase {

    List<Categoria> listar();
}
