package com.example.ecommerce.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api")
public class DeveloperPhotoController {
    private static final long MAX_FILE_SIZE = 5L * 1024 * 1024;

    @Value("${app.upload-dir:uploads}")
    private String uploadDirectory;

    @PostMapping(value = "/admin/developers/photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> uploadPhoto(@RequestPart("image") MultipartFile image) {
        if (image.isEmpty() || image.getSize() > MAX_FILE_SIZE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Choose an image smaller than 5 MB.");
        }

        String extension = switch (image.getContentType() == null ? "" : image.getContentType().toLowerCase()) {
            case "image/jpeg" -> ".jpg";
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            case "image/gif" -> ".gif";
            default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Choose a JPG, PNG, WebP, or GIF image.");
        };

        String filename = UUID.randomUUID() + extension;
        Path destination = photoDirectory().resolve(filename);
        try {
            Files.createDirectories(destination.getParent());
            image.transferTo(destination);
        } catch (IOException error) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not save the image.", error);
        }

        return ResponseEntity.ok(Map.of("avatar", "/api/developer-photos/" + filename));
    }

    @GetMapping("/developer-photos/{filename}")
    public ResponseEntity<Resource> getPhoto(@PathVariable String filename) {
        if (!filename.matches("[a-f0-9-]{36}\\.(jpg|png|webp|gif)")) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        Path file = photoDirectory().resolve(filename).normalize();
        if (!file.startsWith(photoDirectory()) || !Files.isRegularFile(file)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        String contentType = switch (filename.substring(filename.lastIndexOf('.') + 1)) {
            case "jpg" -> "image/jpeg";
            case "png" -> "image/png";
            case "webp" -> "image/webp";
            default -> "image/gif";
        };
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .cacheControl(CacheControl.maxAge(365, TimeUnit.DAYS).cachePublic().immutable())
                .body(new FileSystemResource(file));
    }

    private Path photoDirectory() {
        return Path.of(uploadDirectory, "developers").toAbsolutePath().normalize();
    }
}
