package com.eagledev.backend.infrastructure.adapter.in.web.controller;

import com.eagledev.backend.application.port.in.ListarCategoriasUseCase;
import com.eagledev.backend.infrastructure.adapter.in.web.dto.CategoriaResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/categorias")
public class CategoriaController {

    private final ListarCategoriasUseCase listarCategorias;

    public CategoriaController(ListarCategoriasUseCase listarCategorias) {
        this.listarCategorias = listarCategorias;
    }

    @GetMapping
    public List<CategoriaResponse> listar() {
        return listarCategorias.listar().stream()
                .map(CategoriaResponse::from)
                .toList();
    }
}
