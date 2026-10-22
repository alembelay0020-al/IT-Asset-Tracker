
package com.example.main.project.repository;

import com.example.main.project.entity.Asset;
import com.example.main.project.entity.AssetStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AssetRepository extends JpaRepository<Asset, Long> {

    Optional<Asset> findBySerialNumber(String serialNumber);

    boolean existsBySerialNumber(String serialNumber);

    List<Asset> findByStatus(AssetStatus status);

    List<Asset> findByAssignedTo_Id(UUID userId);

    List<Asset> findByAssignedTo_IdAndStatus(UUID userId, AssetStatus status);
}
