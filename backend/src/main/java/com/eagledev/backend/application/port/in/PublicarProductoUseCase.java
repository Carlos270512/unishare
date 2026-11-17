package com.eagledev.backend.application.port.in;

import com.eagledev.backend.domain.model.Producto;

import java.io.InputStream;

public interface PublicarProductoUseCase {

    Producto publicar(PublicarProductoCommand command);

    record PublicarProductoCommand(
            String titulo,
            String descripcion,
            String modalidad,
            Long categoriaId,
            Long personaId,
            InputStream imagen,
            String imagenNombreOriginal) {
    }
}
