
package com.example.main.project.dto;

import java.time.LocalDateTime;

public record ErrorResponse(
    LocalDateTime timestamp,
    int status,
    String message,
    String path
) {
}
