package com.eagledev.backend.application.port.in;

import com.eagledev.backend.domain.model.Producto;

import java.util.List;

public interface ListarProductosUseCase {

    List<Producto> listar(Long categoriaId);
}
