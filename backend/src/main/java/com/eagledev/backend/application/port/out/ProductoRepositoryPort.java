package com.eagledev.backend.application.port.out;

import com.eagledev.backend.domain.model.Producto;

import java.util.List;

public interface ProductoRepositoryPort {

    long count();

    List<Producto> findAllByCategoriaId(Long categoriaId);

    Producto save(Producto producto);
}
