package com.eagledev.backend.infrastructure.adapter.out.persistence.repository;

import com.eagledev.backend.infrastructure.adapter.out.persistence.entity.ProductoJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SpringDataProductoRepository extends JpaRepository<ProductoJpaEntity, Long> {

    List<ProductoJpaEntity> findAllByOrderByCreadoEnDesc();

    List<ProductoJpaEntity> findByCategoria_IdOrderByCreadoEnDesc(Long categoriaId);
}
