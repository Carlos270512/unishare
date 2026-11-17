package com.eagledev.backend.infrastructure.adapter.in.web.controller;

import com.eagledev.backend.application.port.in.ListarProductosUseCase;
import com.eagledev.backend.application.port.in.PublicarProductoUseCase;
import com.eagledev.backend.domain.model.Producto;
import com.eagledev.backend.infrastructure.adapter.in.web.dto.ProductoResponse;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/productos")
@Validated
public class ProductoController {

    private final ListarProductosUseCase listarProductos;
    private final PublicarProductoUseCase publicarProducto;

    public ProductoController(
            ListarProductosUseCase listarProductos,
            PublicarProductoUseCase publicarProducto) {
        this.listarProductos = listarProductos;
        this.publicarProducto = publicarProducto;
    }

    @GetMapping
    public List<ProductoResponse> listar(@RequestParam(required = false) Long categoriaId) {
        return listarProductos.listar(categoriaId).stream()
                .map(ProductoResponse::from)
                .toList();
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductoResponse> publicar(
            @RequestParam @NotBlank String titulo,
            @RequestParam @NotBlank String descripcion,
            @RequestParam @NotBlank String modalidad,
            @RequestParam @NotNull Long categoriaId,
            @RequestParam @NotNull Long personaId,
            @RequestParam(value = "imagen", required = false) MultipartFile imagen) throws IOException {

        PublicarProductoUseCase.PublicarProductoCommand command =
                new PublicarProductoUseCase.PublicarProductoCommand(
                        titulo,
                        descripcion,
                        modalidad,
                        categoriaId,
                        personaId,
                        imagen == null || imagen.isEmpty() ? null : imagen.getInputStream(),
                        imagen == null ? null : imagen.getOriginalFilename());

        Producto producto = publicarProducto.publicar(command);
        return ResponseEntity.status(201).body(ProductoResponse.from(producto));
    }
}
