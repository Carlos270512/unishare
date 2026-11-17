package com.eagledev.backend.infrastructure.adapter.out.persistence;

import com.eagledev.backend.application.port.out.UsuarioRepositoryPort;
import com.eagledev.backend.domain.model.Usuario;
import com.eagledev.backend.infrastructure.adapter.out.persistence.entity.UsuarioJpaEntity;
import com.eagledev.backend.infrastructure.adapter.out.persistence.repository.SpringDataPersonaRepository;
import com.eagledev.backend.infrastructure.adapter.out.persistence.repository.SpringDataUsuarioRepository;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Optional;

@Component
public class UsuarioPersistenceAdapter implements UsuarioRepositoryPort {

    private final SpringDataUsuarioRepository repository;
    private final SpringDataPersonaRepository personaRepository;

    public UsuarioPersistenceAdapter(
            SpringDataUsuarioRepository repository,
            SpringDataPersonaRepository personaRepository) {
        this.repository = repository;
        this.personaRepository = personaRepository;
    }

    @Override
    public Optional<Usuario> findByEmail(String email) {
        return repository.findByEmail(email).map(this::toDomain);
    }

    @Override
    public Usuario save(Usuario usuario) {
        UsuarioJpaEntity entity = new UsuarioJpaEntity();
        entity.setPersona(personaRepository.getReferenceById(usuario.personaId()));
        entity.setEmail(usuario.email());
        entity.setPassword(usuario.password());
        entity.setRol(usuario.rol());
        entity.setActivo(usuario.activo());
        entity.setCreadoEn(LocalDateTime.now());
        return toDomain(repository.save(entity));
    }

    private Usuario toDomain(UsuarioJpaEntity entity) {
        return new Usuario(
                entity.getId(),
                entity.getPersona().getId(),
                entity.getEmail(),
                entity.getPassword(),
                entity.getRol(),
                entity.isActivo(),
                entity.getCreadoEn());
    }
}
