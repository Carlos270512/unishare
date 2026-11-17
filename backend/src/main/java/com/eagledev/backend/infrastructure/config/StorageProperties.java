package com.eagledev.backend.infrastructure.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app.uploads")
public class StorageProperties {

    private String dir = "/app/uploads";

    public String getUploadsDir() {
        return dir;
    }

    public void setDir(String dir) {
        this.dir = dir;
    }
}
