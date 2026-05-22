package com.krishimandi.controller;

import com.krishimandi.security.UserDetailsImpl;
import com.krishimandi.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    private UUID getSecureUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetailsImpl) {
            return ((UserDetailsImpl) authentication.getPrincipal()).getId();
        }
        throw new RuntimeException("User not authenticated");
    }

    @GetMapping("/farmer/{userId}")
    @PreAuthorize("hasRole('FARMER') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getFarmerAnalytics(@PathVariable UUID userId) {
        // Enforce extraction from secure JWT context, ignoring the passed path variable
        UUID secureUserId = getSecureUserId();
        return ResponseEntity.ok(analyticsService.getFarmerAnalytics(secureUserId));
    }

    @GetMapping("/vendor/{userId}")
    @PreAuthorize("hasRole('VENDOR') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getVendorAnalytics(@PathVariable UUID userId) {
        // Enforce extraction from secure JWT context, ignoring the passed path variable
        UUID secureUserId = getSecureUserId();
        return ResponseEntity.ok(analyticsService.getVendorAnalytics(secureUserId));
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAdminAnalytics() {
        return ResponseEntity.ok(analyticsService.getAdminAnalytics());
    }
}
