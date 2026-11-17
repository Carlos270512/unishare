package com.eagledev.backend.application.service;

import com.eagledev.backend.application.port.in.RegistrarUsuarioUseCase;
import com.eagledev.backend.application.port.out.ImagenStoragePort;
import com.eagledev.backend.application.port.out.PasswordEncoderPort;
import com.eagledev.backend.application.port.out.PersonaRepositoryPort;
import com.eagledev.backend.application.port.out.UsuarioRepositoryPort;
import com.eagledev.backend.domain.exception.CedulaYaRegistradaException;
import com.eagledev.backend.domain.exception.EmailYaRegistradoException;
import com.eagledev.backend.domain.model.Persona;
import com.eagledev.backend.domain.model.Rol;
import com.eagledev.backend.domain.model.Usuario;
import org.springframework.stereotype.Service;

@Service
public class RegistrarUsuarioService implements RegistrarUsuarioUseCase {

    private final PersonaRepositoryPort personaRepository;
    private final UsuarioRepositoryPort usuarioRepository;
    private final ImagenStoragePort imagenStorage;
    private final PasswordEncoderPort passwordEncoder;

    public RegistrarUsuarioService(
            PersonaRepositoryPort personaRepository,
            UsuarioRepositoryPort usuarioRepository,
            ImagenStoragePort imagenStorage,
            PasswordEncoderPort passwordEncoder) {
        this.personaRepository = personaRepository;
        this.usuarioRepository = usuarioRepository;
        this.imagenStorage = imagenStorage;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Usuario registrar(RegistrarUsuarioCommand command) {
        if (personaRepository.existsByCedula(command.cedula())) {
            throw new CedulaYaRegistradaException(command.cedula());
        }
        if (personaRepository.existsByEmail(command.email())) {
            throw new EmailYaRegistradoException(command.email());
        }

        String fotoUrl = null;
        if (command.foto() != null && command.fotoNombreOriginal() != null
                && !command.fotoNombreOriginal().isBlank()) {
            fotoUrl = imagenStorage.guardar(command.fotoNombreOriginal(), command.foto());
        }

        String nombreCompleto = (command.nombres() + " " + command.apellidos()).trim();

        Persona persona = new Persona(
                null,
                command.cedula(),
                command.nombres(),
                command.apellidos(),
                nombreCompleto,
                command.email(),
                command.telefono(),
                fotoUrl,
                null);

        Persona personaGuardada = personaRepository.save(persona);

        Usuario usuario = new Usuario(
                null,
                personaGuardada.id(),
                command.email(),
                passwordEncoder.encode(command.password()),
                Rol.ESTUDIANTE,
                true,
                null);

        return usuarioRepository.save(usuario);
    }
}
