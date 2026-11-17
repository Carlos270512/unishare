package com.eagledev.backend.infrastructure.adapter.out.storage;

import com.eagledev.backend.application.port.out.ImagenStoragePort;
import com.eagledev.backend.infrastructure.config.StorageProperties;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Component
public class LocalFileImageStorageAdapter implements ImagenStoragePort {

    private final StorageProperties storageProperties;

    public LocalFileImageStorageAdapter(StorageProperties storageProperties) {
        this.storageProperties = storageProperties;
    }

    @Override
    public String guardar(String nombreOriginal, InputStream contenido) {
        String extension = extraerExtension(nombreOriginal);
        if (extension.isEmpty()) {
            extension = ".png";
        }

        String nombreArchivo = UUID.randomUUID().toString().replace("-", "") + extension;

        try {
            Path directorio = Paths.get(storageProperties.getUploadsDir());
            Files.createDirectories(directorio);
            Path destino = directorio.resolve(nombreArchivo).normalize();

            try (InputStream in = contenido) {
                Files.copy(in, destino, StandardCopyOption.REPLACE_EXISTING);
            }

            return nombreArchivo;
        } catch (IOException e) {
            throw new IllegalStateException("No se pudo guardar la imagen", e);
        }
    }

    private String extraerExtension(String nombre) {
        if (nombre == null) {
            return "";
        }
        int indice = nombre.lastIndexOf('.');
        if (indice >= 0 && indice < nombre.length() - 1) {
            return nombre.substring(indice).toLowerCase();
        }
        return "";
    }
}
