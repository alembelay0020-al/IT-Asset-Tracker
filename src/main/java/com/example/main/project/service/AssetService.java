
package com.example.main.project.service;

import com.example.main.project.dto.AssetRequest;
import com.example.main.project.dto.AssetResponse;
import com.example.main.project.entity.Asset;
import com.example.main.project.entity.AssetStatus;
import com.example.main.project.entity.Category;
import com.example.main.project.entity.User;
import com.example.main.project.repository.AssetRepository;
import com.example.main.project.repository.CategoryRepository;
import com.example.main.project.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class AssetService {

    private final AssetRepository assetRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public AssetService(
            AssetRepository assetRepository,
            CategoryRepository categoryRepository,
            UserRepository userRepository) {
        this.assetRepository = assetRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<AssetResponse> getAllAssets(AssetStatus status) {
        List<Asset> assets = status == null
                ? assetRepository.findAll()
                : assetRepository.findByStatus(status);

        return assets.stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AssetResponse> getMyAssets(UUID userId) {
        return assetRepository.findByAssignedTo_Id(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public AssetResponse createAsset(AssetRequest request) {
        String serialNumber = request.serialNumber().trim();

        if (assetRepository.existsBySerialNumber(serialNumber)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "An asset with this serial number already exists"
            );
        }

        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Category not found"
                ));

        Asset asset = new Asset(
                request.name().trim(),
                serialNumber,
                category
        );

        asset.setStatus(AssetStatus.AVAILABLE);

        return toResponse(assetRepository.save(asset));
    }

    public AssetResponse assignAsset(Long assetId, UUID userId) {
        Asset asset = findAsset(assetId);

        if (asset.getStatus() != AssetStatus.AVAILABLE) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Only available assets can be assigned"
            );
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"
                ));

        asset.setAssignedTo(user);
        asset.setStatus(AssetStatus.ASSIGNED);

        return toResponse(assetRepository.save(asset));
    }

    public AssetResponse returnAsset(Long assetId) {
        Asset asset = findAsset(assetId);

        if (asset.getStatus() != AssetStatus.ASSIGNED) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Only assigned assets can be returned"
            );
        }

        asset.setAssignedTo(null);
        asset.setStatus(AssetStatus.AVAILABLE);

        return toResponse(assetRepository.save(asset));
    }

    public void deleteAsset(Long assetId) {
        Asset asset = findAsset(assetId);
        assetRepository.delete(asset);
    }

    private Asset findAsset(Long assetId) {
        return assetRepository.findById(assetId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Asset not found"
                ));
    }

    private AssetResponse toResponse(Asset asset) {
        User assignedTo = asset.getAssignedTo();

        return new AssetResponse(
                asset.getId(),
                asset.getName(),
                asset.getSerialNumber(),
                asset.getStatus(),
                asset.getCategory().getId(),
                asset.getCategory().getName(),
                assignedTo == null ? null : assignedTo.getId(),
                assignedTo == null ? null : assignedTo.getUsername(),
                asset.getCreatedAt()
        );
    }
}
