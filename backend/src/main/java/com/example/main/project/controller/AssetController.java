
package com.example.main.project.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.main.project.dto.AssetRequest;
import com.example.main.project.dto.AssetResponse;
import com.example.main.project.entity.AssetStatus;
import com.example.main.project.entity.User;
import com.example.main.project.repository.UserRepository;
import com.example.main.project.service.AssetService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/assets")
public class AssetController {

    private final AssetService assetService;
    private final UserRepository userRepository;

    public AssetController(
            AssetService assetService,
            UserRepository userRepository) {
        this.assetService = assetService;
        this.userRepository = userRepository;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public List<AssetResponse> getAllAssets(
            @RequestParam(required = false) AssetStatus status) {
        return assetService.getAllAssets(status);
    }

    @GetMapping("/my-assets")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public List<AssetResponse> getMyAssets(
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() ->
                        new org.springframework.web.server.ResponseStatusException(
                                HttpStatus.NOT_FOUND, "User not found"));

        return assetService.getMyAssets(user.getId());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public AssetResponse createAsset(
            @Valid @RequestBody AssetRequest request) {
        return assetService.createAsset(request);
    }

    @PatchMapping("/{id}/assign/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public AssetResponse assignAsset(
            @PathVariable Long id,
            @PathVariable UUID userId) {
        return assetService.assignAsset(id, userId);
    }

    @PatchMapping("/{id}/return")
    @PreAuthorize("hasRole('ADMIN')")
    public AssetResponse returnAsset(@PathVariable Long id) {
        return assetService.returnAsset(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteAsset(@PathVariable Long id) {
        assetService.deleteAsset(id);
    }
}
