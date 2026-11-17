package com.eagledev.backend.infrastructure.adapter.in.web.controller;

import com.eagledev.backend.application.port.in.RegistrarUsuarioUseCase;
import com.eagledev.backend.application.port.in.VerificarCedulaUseCase;
import com.eagledev.backend.domain.model.Usuario;
import com.eagledev.backend.infrastructure.adapter.in.web.dto.DatosCedulaResponse;
import com.eagledev.backend.infrastructure.adapter.in.web.dto.UsuarioResponse;
import com.eagledev.backend.infrastructure.adapter.in.web.dto.VerificarCedulaRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/auth")
@Validated
public class AuthController {

    private final RegistrarUsuarioUseCase registrarUsuario;
    private final VerificarCedulaUseCase verificarCedula;

    public AuthController(RegistrarUsuarioUseCase registrarUsuario, VerificarCedulaUseCase verificarCedula) {
        this.registrarUsuario = registrarUsuario;
        this.verificarCedula = verificarCedula;
    }

    @PostMapping(value = "/registro", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UsuarioResponse> registrar(
            @RequestParam @NotBlank String cedula,
            @RequestParam @NotBlank String nombres,
            @RequestParam @NotBlank String apellidos,
            @RequestParam @Email @NotBlank String email,
            @RequestParam @NotBlank String password,
            @RequestParam(required = false) String telefono,
            @RequestParam(value = "foto", required = false) MultipartFile foto) throws IOException {

        RegistrarUsuarioUseCase.RegistrarUsuarioCommand command =
                new RegistrarUsuarioUseCase.RegistrarUsuarioCommand(
                        cedula,
                        nombres,
                        apellidos,
                        email,
                        password,
                        telefono,
                        foto == null || foto.isEmpty() ? null : foto.getInputStream(),
                        foto == null ? null : foto.getOriginalFilename());

        Usuario usuario = registrarUsuario.registrar(command);
        return ResponseEntity.status(201).body(UsuarioResponse.from(usuario));
    }

    @PostMapping(value = "/verificar-cedula", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DatosCedulaResponse> verificarCedula(@Valid @RequestBody VerificarCedulaRequest request) {
        return ResponseEntity.ok(DatosCedulaResponse.from(verificarCedula.verificar(request.cedula())));
    }
}
