package com.krishimandi.controller;

import com.krishimandi.entity.Farmer;
import com.krishimandi.entity.Product;
import com.krishimandi.exception.ResourceNotFoundException;
import com.krishimandi.repository.FarmerRepository;
import com.krishimandi.security.UserDetailsImpl;
import com.krishimandi.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private FarmerRepository farmerRepository;

    private UUID getSecureUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetailsImpl) {
            return ((UserDetailsImpl) authentication.getPrincipal()).getId();
        }
        throw new RuntimeException("User not authenticated");
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable UUID id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable UUID categoryId) {
        return ResponseEntity.ok(productService.getProductsByCategory(categoryId));
    }

    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<List<Product>> getProductsByFarmer(@PathVariable UUID farmerId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetailsImpl) {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            if ("FARMER".equals(userDetails.getRole())) {
                Farmer farmer = farmerRepository.findByUserId(userDetails.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Farmer profile not found"));
                return ResponseEntity.ok(productService.getProductsByFarmer(farmer.getId()));
            }
        }
        return ResponseEntity.ok(productService.getProductsByFarmer(farmerId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam("q") String query) {
        return ResponseEntity.ok(productService.searchProducts(query));
    }

    @PostMapping
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<Product> createProduct(
            @RequestBody Product product,
            @RequestParam UUID farmerId,
            @RequestParam UUID categoryId) {
        UUID secureUserId = getSecureUserId();
        Farmer farmer = farmerRepository.findByUserId(secureUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Farmer profile not found"));
        return ResponseEntity.ok(productService.createProduct(product, farmer.getId(), categoryId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('FARMER') or hasRole('ADMIN')")
    public ResponseEntity<Product> updateProduct(@PathVariable UUID id, @RequestBody Product product) {
        return ResponseEntity.ok(productService.updateProduct(id, product));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('FARMER') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteProduct(@PathVariable UUID id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok("Product deleted successfully");
    }

    // Advanced Feature 1: Nearby Supplier Matching
    @GetMapping("/nearby")
    public ResponseEntity<List<Map<String, Object>>> getNearbySuppliers(
            @RequestParam double lat,
            @RequestParam double lon,
            @RequestParam(defaultValue = "50") double radiusKm) {
        
        List<Farmer> farmers = farmerRepository.findAll();
        List<Map<String, Object>> nearbySuppliers = new ArrayList<>();

        for (Farmer farmer : farmers) {
            if (farmer.getUser().getLatitude() == null || farmer.getUser().getLongitude() == null) {
                continue;
            }

            double distance = calculateDistance(lat, lon, farmer.getUser().getLatitude(), farmer.getUser().getLongitude());

            if (distance <= radiusKm) {
                Map<String, Object> map = new HashMap<>();
                map.put("farmerId", farmer.getId());
                map.put("farmName", farmer.getFarmName());
                map.put("farmerName", farmer.getUser().getName());
                map.put("phone", farmer.getUser().getPhone());
                map.put("address", farmer.getUser().getAddress());
                map.put("verified", farmer.getVerified());
                map.put("distanceKm", Math.round(distance * 10.0) / 10.0);
                map.put("latitude", farmer.getUser().getLatitude());
                map.put("longitude", farmer.getUser().getLongitude());
                nearbySuppliers.add(map);
            }
        }

        // Sort by distance ascending
        nearbySuppliers.sort(Comparator.comparingDouble(m -> (double) m.get("distanceKm")));

        return ResponseEntity.ok(nearbySuppliers);
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        double R = 6371; // Earth radius in km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
