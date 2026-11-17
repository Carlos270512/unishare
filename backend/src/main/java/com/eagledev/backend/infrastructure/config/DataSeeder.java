package com.eagledev.backend.infrastructure.config;

import com.eagledev.backend.application.port.in.PublicarProductoUseCase;
import com.eagledev.backend.application.port.in.RegistrarUsuarioUseCase;
import com.eagledev.backend.application.port.out.CategoriaRepositoryPort;
import com.eagledev.backend.application.port.out.PersonaRepositoryPort;
import com.eagledev.backend.application.port.out.ProductoRepositoryPort;
import com.eagledev.backend.domain.model.Categoria;
import com.eagledev.backend.domain.model.Persona;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final String CEDULA_SEMILLA = "1727168168";

    private final RegistrarUsuarioUseCase registrarUsuario;
    private final PublicarProductoUseCase publicarProducto;
    private final PersonaRepositoryPort personaRepository;
    private final ProductoRepositoryPort productoRepository;
    private final CategoriaRepositoryPort categoriaRepository;

    public DataSeeder(
            RegistrarUsuarioUseCase registrarUsuario,
            PublicarProductoUseCase publicarProducto,
            PersonaRepositoryPort personaRepository,
            ProductoRepositoryPort productoRepository,
            CategoriaRepositoryPort categoriaRepository) {
        this.registrarUsuario = registrarUsuario;
        this.publicarProducto = publicarProducto;
        this.personaRepository = personaRepository;
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (!personaRepository.existsByCedula(CEDULA_SEMILLA)) {
            registrarUsuario.registrar(new RegistrarUsuarioUseCase.RegistrarUsuarioCommand(
                    CEDULA_SEMILLA,
                    "Fabián",
                    "Torres",
                    "fabian.torres@unishare.edu.ec",
                    "123",
                    "0999999999",
                    null,
                    null));
        }

        if (productoRepository.count() > 0) {
            return;
        }

        Persona semilla = personaRepository.findByCedula(CEDULA_SEMILLA)
                .orElseThrow(() -> new IllegalStateException("Persona semilla no encontrada"));

        publicar("Libros",
                "Cálculo de una variable - Stewart",
                "Libro en buen estado, ideal para primer semestre de ingeniería.",
                "DONACION",
                semilla.id(),
                "seed-libros.svg");

        publicar("Tecnología",
                "Laptop HP para préstamo de semestre",
                "Laptop i5, 8 GB RAM y 256 GB SSD. Préstamo por semestre.",
                "PRESTAMO",
                semilla.id(),
                "seed-tecnologia.svg");

        publicar("Laboratorio",
                "Kit de química básica",
                "Vasos, probetas y soporte para prácticas de química general.",
                "DONACION",
                semilla.id(),
                "seed-laboratorio.svg");

        publicar("Otro",
                "Calculadora científica Casio",
                "Calculadora científica funcional, ideal para exámenes.",
                "PRESTAMO",
                semilla.id(),
                "seed-otro.svg");
    }

    private void publicar(
            String categoriaNombre,
            String titulo,
            String descripcion,
            String modalidad,
            Long personaId,
            String imagenClasspath) throws Exception {

        Categoria categoria = categoriaRepository.findByNombre(categoriaNombre)
                .orElseThrow(() -> new IllegalStateException("Categoría semilla no encontrada: " + categoriaNombre));

        InputStream imagen = new ClassPathResource("seed/" + imagenClasspath).getInputStream();

        publicarProducto.publicar(new PublicarProductoUseCase.PublicarProductoCommand(
                titulo,
                descripcion,
                modalidad,
                categoria.id(),
                personaId,
                imagen,
                imagenClasspath));
    }
}
