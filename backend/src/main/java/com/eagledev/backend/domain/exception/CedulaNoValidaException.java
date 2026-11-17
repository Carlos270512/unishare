package com.eagledev.backend.domain.exception;

public class CedulaNoValidaException extends RuntimeException {
    public CedulaNoValidaException(String cedula) {
        super("La cédula " + cedula + " no es válida o no se pudo verificar.");
    }
}
