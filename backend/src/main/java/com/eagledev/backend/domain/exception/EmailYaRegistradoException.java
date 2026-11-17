package com.eagledev.backend.domain.exception;

public class EmailYaRegistradoException extends RuntimeException {
    public EmailYaRegistradoException(String email) {
        super("El correo ya está registrado: " + email);
    }
}
