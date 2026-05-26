package com.krishimandi.controller;

import com.krishimandi.entity.Order;
import com.krishimandi.entity.OrderStatus;
import com.krishimandi.security.UserDetailsImpl;
import com.krishimandi.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    private UUID getSecureUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetailsImpl) {
            return ((UserDetailsImpl) authentication.getPrincipal()).getId();
        }
        throw new RuntimeException("User not authenticated");
    }

    @GetMapping("/vendor/{vendorUserId}")
    @PreAuthorize("hasRole('VENDOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getVendorOrders(@PathVariable UUID vendorUserId) {
        UUID secureUserId = getSecureUserId();
        return ResponseEntity.ok(orderService.getOrdersByVendor(secureUserId));
    }

    @GetMapping("/farmer/{farmerUserId}")
    @PreAuthorize("hasRole('FARMER') or hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getFarmerOrders(@PathVariable UUID farmerUserId) {
        UUID secureUserId = getSecureUserId();
        return ResponseEntity.ok(orderService.getOrdersByFarmer(secureUserId));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable UUID id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<Order> placeOrder(@RequestBody Map<String, Object> payload) {
        UUID secureUserId = getSecureUserId();
        
        UUID productId = UUID.fromString(payload.get("productId").toString());
        BigDecimal quantity = new BigDecimal(payload.get("quantity").toString());
        String unitType = payload.get("unitType") != null ? payload.get("unitType").toString() : "KG";
        
        String deliveryAddress = payload.get("deliveryAddress") != null ? payload.get("deliveryAddress").toString() : "";
        Double lat = payload.get("latitude") != null ? Double.parseDouble(payload.get("latitude").toString()) : null;
        Double lon = payload.get("longitude") != null ? Double.parseDouble(payload.get("longitude").toString()) : null;
        String paymentMethod = payload.get("paymentMethod") != null ? payload.get("paymentMethod").toString() : "COD";

        Order order = orderService.placeOrder(secureUserId, productId, quantity, unitType, deliveryAddress, lat, lon, paymentMethod);
        return ResponseEntity.ok(order);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('FARMER') or hasRole('ADMIN')")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable UUID id,
            @RequestParam OrderStatus status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Order> cancelOrder(
            @PathVariable UUID id,
            @RequestParam UUID userId) {
        UUID secureUserId = getSecureUserId();
        return ResponseEntity.ok(orderService.cancelOrder(id, secureUserId));
    }
}
