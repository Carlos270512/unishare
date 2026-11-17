package com.eagledev.backend.domain.exception;

public class CedulaYaRegistradaException extends RuntimeException {
    public CedulaYaRegistradaException(String cedula) {
        super("La cédula ya está registrada: " + cedula);
    }
}
