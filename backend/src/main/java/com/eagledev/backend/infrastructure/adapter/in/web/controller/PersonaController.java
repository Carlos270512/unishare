package com.eagledev.backend.infrastructure.adapter.in.web.controller;

import com.eagledev.backend.application.port.in.BuscarPersonaPorCedulaUseCase;
import com.eagledev.backend.infrastructure.adapter.in.web.dto.PersonaResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/personas")
public class PersonaController {

    private final BuscarPersonaPorCedulaUseCase buscarPersonaPorCedula;

    public PersonaController(BuscarPersonaPorCedulaUseCase buscarPersonaPorCedula) {
        this.buscarPersonaPorCedula = buscarPersonaPorCedula;
    }

    @GetMapping("/cedula/{cedula}")
    public ResponseEntity<PersonaResponse> porCedula(@PathVariable String cedula) {
        return buscarPersonaPorCedula.buscar(cedula)
                .map(PersonaResponse::from)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
