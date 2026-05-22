package com.krishimandi.repository;

import com.krishimandi.entity.Farmer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FarmerRepository extends JpaRepository<Farmer, UUID> {
    Optional<Farmer> findByUserId(UUID userId);
    Optional<Farmer> findByUserEmail(String email);
    List<Farmer> findByVerified(Boolean verified);
}
