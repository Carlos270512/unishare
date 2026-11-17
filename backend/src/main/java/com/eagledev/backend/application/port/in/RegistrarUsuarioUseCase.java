package com.eagledev.backend.application.port.in;

import com.eagledev.backend.domain.model.Usuario;

import java.io.InputStream;

public interface RegistrarUsuarioUseCase {

    Usuario registrar(RegistrarUsuarioCommand command);

    record RegistrarUsuarioCommand(
            String cedula,
            String nombres,
            String apellidos,
            String email,
            String password,
            String telefono,
            InputStream foto,
            String fotoNombreOriginal) {
    }
}
