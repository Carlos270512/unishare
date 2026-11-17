package com.eagledev.backend.application.service;

import com.eagledev.backend.application.port.in.PublicarProductoUseCase;
import com.eagledev.backend.application.port.out.CategoriaRepositoryPort;
import com.eagledev.backend.application.port.out.ImagenStoragePort;
import com.eagledev.backend.application.port.out.PersonaRepositoryPort;
import com.eagledev.backend.application.port.out.ProductoRepositoryPort;
import com.eagledev.backend.domain.exception.CategoriaNoEncontradaException;
import com.eagledev.backend.domain.exception.PersonaNoEncontradaException;
import com.eagledev.backend.domain.model.Categoria;
import com.eagledev.backend.domain.model.EstadoProducto;
import com.eagledev.backend.domain.model.Modalidad;
import com.eagledev.backend.domain.model.Producto;
import org.springframework.stereotype.Service;

@Service
public class PublicarProductoService implements PublicarProductoUseCase {

    private final ProductoRepositoryPort productoRepository;
    private final CategoriaRepositoryPort categoriaRepository;
    private final PersonaRepositoryPort personaRepository;
    private final ImagenStoragePort imagenStorage;

    public PublicarProductoService(
            ProductoRepositoryPort productoRepository,
            CategoriaRepositoryPort categoriaRepository,
            PersonaRepositoryPort personaRepository,
            ImagenStoragePort imagenStorage) {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
        this.personaRepository = personaRepository;
        this.imagenStorage = imagenStorage;
    }

    @Override
    public Producto publicar(PublicarProductoCommand command) {
        Modalidad modalidad;
        try {
            modalidad = Modalidad.valueOf(command.modalidad().toUpperCase());
        } catch (RuntimeException e) {
            throw new IllegalArgumentException("Modalidad inválida: " + command.modalidad());
        }

        Categoria categoria = categoriaRepository.findById(command.categoriaId())
                .orElseThrow(() -> new CategoriaNoEncontradaException(command.categoriaId()));

        personaRepository.findById(command.personaId())
                .orElseThrow(() -> new PersonaNoEncontradaException(command.personaId()));

        String imagenUrl = null;
        if (command.imagen() != null && command.imagenNombreOriginal() != null
                && !command.imagenNombreOriginal().isBlank()) {
            imagenUrl = imagenStorage.guardar(command.imagenNombreOriginal(), command.imagen());
        }

        Producto producto = new Producto(
                null,
                command.titulo(),
                command.descripcion(),
                modalidad,
                categoria.id(),
                categoria.nombre(),
                imagenUrl,
                command.personaId(),
                null,
                null,
                EstadoProducto.DISPONIBLE,
                null);

        return productoRepository.save(producto);
    }
}
