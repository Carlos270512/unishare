package com.eagledev.backend.application.service;

import com.eagledev.backend.application.port.in.VerificarCedulaUseCase;
import com.eagledev.backend.application.port.out.CedulaVerificationPort;
import com.eagledev.backend.domain.exception.CedulaNoValidaException;
import com.eagledev.backend.domain.model.DatosCedula;
import org.springframework.stereotype.Service;

@Service
public class VerificarCedulaService implements VerificarCedulaUseCase {

    private final CedulaVerificationPort cedulaVerificationPort;

    public VerificarCedulaService(CedulaVerificationPort cedulaVerificationPort) {
        this.cedulaVerificationPort = cedulaVerificationPort;
    }

    @Override
    public DatosCedula verificar(String cedula) {
        return cedulaVerificationPort.consultar(cedula)
                .orElseThrow(() -> new CedulaNoValidaException(cedula));
    }
}
