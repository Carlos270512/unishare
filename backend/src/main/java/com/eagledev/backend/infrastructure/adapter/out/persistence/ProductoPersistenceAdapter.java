package com.eagledev.backend.infrastructure.adapter.out.persistence;

import com.eagledev.backend.application.port.out.ProductoRepositoryPort;
import com.eagledev.backend.domain.exception.CategoriaNoEncontradaException;
import com.eagledev.backend.domain.exception.PersonaNoEncontradaException;
import com.eagledev.backend.domain.model.Producto;
import com.eagledev.backend.infrastructure.adapter.out.persistence.entity.CategoriaJpaEntity;
import com.eagledev.backend.infrastructure.adapter.out.persistence.entity.PersonaJpaEntity;
import com.eagledev.backend.infrastructure.adapter.out.persistence.entity.ProductoJpaEntity;
import com.eagledev.backend.infrastructure.adapter.out.persistence.repository.SpringDataCategoriaRepository;
import com.eagledev.backend.infrastructure.adapter.out.persistence.repository.SpringDataPersonaRepository;
import com.eagledev.backend.infrastructure.adapter.out.persistence.repository.SpringDataProductoRepository;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class ProductoPersistenceAdapter implements ProductoRepositoryPort {

    private final SpringDataProductoRepository repository;
    private final SpringDataCategoriaRepository categoriaRepository;
    private final SpringDataPersonaRepository personaRepository;

    public ProductoPersistenceAdapter(
            SpringDataProductoRepository repository,
            SpringDataCategoriaRepository categoriaRepository,
            SpringDataPersonaRepository personaRepository) {
        this.repository = repository;
        this.categoriaRepository = categoriaRepository;
        this.personaRepository = personaRepository;
    }

    @Override
    public long count() {
        return repository.count();
    }

    @Override
    public List<Producto> findAllByCategoriaId(Long categoriaId) {
        List<ProductoJpaEntity> entities = (categoriaId == null)
                ? repository.findAllByOrderByCreadoEnDesc()
                : repository.findByCategoria_IdOrderByCreadoEnDesc(categoriaId);
        return entities.stream().map(this::toDomain).toList();
    }

    @Override
    public Producto save(Producto producto) {
        CategoriaJpaEntity categoria = categoriaRepository.findById(producto.categoriaId())
                .orElseThrow(() -> new CategoriaNoEncontradaException(producto.categoriaId()));
        PersonaJpaEntity persona = personaRepository.findById(producto.personaId())
                .orElseThrow(() -> new PersonaNoEncontradaException(producto.personaId()));

        ProductoJpaEntity entity = new ProductoJpaEntity();
        entity.setTitulo(producto.titulo());
        entity.setDescripcion(producto.descripcion());
        entity.setModalidad(producto.modalidad());
        entity.setCategoria(categoria);
        entity.setPersona(persona);
        entity.setImagenUrl(producto.imagenUrl());
        entity.setEstado(producto.estado());
        entity.setCreadoEn(LocalDateTime.now());
        return toDomain(repository.save(entity));
    }

    private Producto toDomain(ProductoJpaEntity entity) {
        return new Producto(
                entity.getId(),
                entity.getTitulo(),
                entity.getDescripcion(),
                entity.getModalidad(),
                entity.getCategoria().getId(),
                entity.getCategoria().getNombre(),
                entity.getImagenUrl(),
                entity.getPersona().getId(),
                entity.getPersona().getEmail(),
                entity.getPersona().getNombreCompleto(),
                entity.getEstado(),
                entity.getCreadoEn());
    }
}
