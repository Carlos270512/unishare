package com.eagledev.backend.application.port.out;

import com.eagledev.backend.domain.model.Usuario;

import java.util.Optional;

public interface UsuarioRepositoryPort {

    Usuario save(Usuario usuario);

    Optional<Usuario> findByEmail(String email);
}
