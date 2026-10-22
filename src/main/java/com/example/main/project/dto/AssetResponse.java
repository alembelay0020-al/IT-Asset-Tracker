
package com.example.main.project.dto;

import com.example.main.project.entity.AssetStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record AssetResponse(
    Long id,
    String name,
    String serialNumber,
    AssetStatus status,
    Long categoryId,
    String categoryName,
    UUID assignedToId,
    String assignedToUsername,
    LocalDateTime createdAt
) {
}
