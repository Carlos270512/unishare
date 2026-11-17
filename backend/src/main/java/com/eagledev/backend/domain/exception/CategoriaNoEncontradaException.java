package com.eagledev.backend.domain.exception;

public class CategoriaNoEncontradaException extends RuntimeException {
    public CategoriaNoEncontradaException(Long id) {
        super("Categoría no encontrada con id: " + id);
    }
}
