package com.eagledev.backend.infrastructure.adapter.out.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "personas")
@Getter
@Setter
@NoArgsConstructor
public class PersonaJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String cedula;

    @Column(nullable = false, length = 120)
    private String nombres;

    @Column(nullable = false, length = 120)
    private String apellidos;

    @Column(name = "nombre_completo", nullable = false, length = 240)
    private String nombreCompleto;

    @Column(nullable = false, unique = true, length = 160)
    private String email;

    @Column(length = 20)
    private String telefono;

    @Column(name = "foto_url", length = 255)
    private String fotoUrl;

    @Column(name = "creado_en", nullable = false, updatable = false)
    private LocalDateTime creadoEn;
}
