package com.eagledev.backend.infrastructure.adapter.out.cedula;

import com.eagledev.backend.application.port.out.CedulaVerificationPort;
import com.eagledev.backend.domain.model.DatosCedula;
import com.eagledev.backend.infrastructure.config.ZuiconsulProperties;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.Map;
import java.util.Optional;

@Component
public class ZuiconsulCedulaAdapter implements CedulaVerificationPort {

    private final ZuiconsulProperties properties;
    private final RestClient restClient;

    public ZuiconsulCedulaAdapter(ZuiconsulProperties properties) {
        this.properties = properties;
        this.restClient = RestClient.builder().build();
    }

    @Override
    public Optional<DatosCedula> consultar(String cedula) {
        try {
            String url = properties.getUrl() + "?tipo=CI&documento=" + cedula;

            ZuiconsulResponse respuesta = restClient.get()
                    .uri(url)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + properties.getToken())
                    .retrieve()
                    .body(ZuiconsulResponse.class);

            if (respuesta == null || !respuesta.success() || respuesta.data() == null) {
                return Optional.empty();
            }

            Map<String, Object> data = respuesta.data();
            String nombres = texto(data.get("nombres"));
            String apellidos = texto(data.get("apellidos"));
            String nombreCompleto = texto(data.get("nombre_completo"));

            return Optional.of(new DatosCedula(cedula, nombres, apellidos, nombreCompleto));
        } catch (RestClientException e) {
            return Optional.empty();
        }
    }

    private String texto(Object valor) {
        return valor == null ? "" : valor.toString();
    }

    private record ZuiconsulResponse(boolean success, String error, Map<String, Object> data) {
    }
}
