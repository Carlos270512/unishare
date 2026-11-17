package com.eagledev.backend.infrastructure.exception;

import com.eagledev.backend.domain.exception.CategoriaNoEncontradaException;
import com.eagledev.backend.domain.exception.CedulaNoValidaException;
import com.eagledev.backend.domain.exception.CedulaYaRegistradaException;
import com.eagledev.backend.domain.exception.EmailYaRegistradoException;
import com.eagledev.backend.domain.exception.PersonaNoEncontradaException;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String, Object>> manejarConstraint(ConstraintViolationException e) {
        return respuesta(HttpStatus.BAD_REQUEST, "Datos inválidos", e.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> manejarArgumento(IllegalArgumentException e) {
        return respuesta(HttpStatus.BAD_REQUEST, "Datos inválidos", e.getMessage());
    }

    @ExceptionHandler(CedulaNoValidaException.class)
    public ResponseEntity<Map<String, Object>> manejarCedula(CedulaNoValidaException e) {
        return respuesta(HttpStatus.BAD_REQUEST, "Cédula no válida", e.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> manejarValidacion(MethodArgumentNotValidException e) {
        String mensaje = e.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));
        return respuesta(HttpStatus.BAD_REQUEST, "Datos inválidos", mensaje);
    }

    @ExceptionHandler({EmailYaRegistradoException.class, CedulaYaRegistradaException.class})
    public ResponseEntity<Map<String, Object>> manejarConflicto(RuntimeException e) {
        return respuesta(HttpStatus.CONFLICT, "Conflicto", e.getMessage());
    }

    @ExceptionHandler({CategoriaNoEncontradaException.class, PersonaNoEncontradaException.class})
    public ResponseEntity<Map<String, Object>> manejarNoEncontrado(RuntimeException e) {
        return respuesta(HttpStatus.NOT_FOUND, "No encontrado", e.getMessage());
    }

    private ResponseEntity<Map<String, Object>> respuesta(HttpStatus status, String error, String mensaje) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", status.value());
        body.put("error", error);
        body.put("mensaje", mensaje);
        return ResponseEntity.status(status).body(body);
    }
}
