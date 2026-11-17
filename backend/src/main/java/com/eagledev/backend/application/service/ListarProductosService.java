package com.eagledev.backend.application.service;

import com.eagledev.backend.application.port.in.ListarProductosUseCase;
import com.eagledev.backend.application.port.out.ProductoRepositoryPort;
import com.eagledev.backend.domain.model.Producto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ListarProductosService implements ListarProductosUseCase {

    private final ProductoRepositoryPort productoRepository;

    public ListarProductosService(ProductoRepositoryPort productoRepository) {
        this.productoRepository = productoRepository;
    }

    @Override
    public List<Producto> listar(Long categoriaId) {
        return productoRepository.findAllByCategoriaId(categoriaId);
    }
}
