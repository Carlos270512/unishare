package com.eagledev.backend.application.port.out;

import java.io.InputStream;

public interface ImagenStoragePort {

    /**
     * Guarda el contenido de una imagen y devuelve el nombre de archivo generado.
     */
    String guardar(String nombreOriginal, InputStream contenido);
}
