package com.krishimandi.controller;

import com.krishimandi.entity.Cart;
import com.krishimandi.security.UserDetailsImpl;
import com.krishimandi.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/carts")
public class CartController {

    @Autowired
    private CartService cartService;

    private UUID getSecureUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetailsImpl) {
            return ((UserDetailsImpl) authentication.getPrincipal()).getId();
        }
        throw new RuntimeException("User not authenticated");
    }

    @GetMapping
    public ResponseEntity<Cart> getCart(@RequestParam(required = false) UUID userId) {
        UUID secureUserId = getSecureUserId();
        return ResponseEntity.ok(cartService.getCartByUser(secureUserId));
    }

    @PostMapping("/items")
    public ResponseEntity<Cart> addItemToCart(
            @RequestParam(required = false) UUID userId,
            @RequestParam UUID productId,
            @RequestParam BigDecimal quantity) {
        UUID secureUserId = getSecureUserId();
        return ResponseEntity.ok(cartService.addItemToCart(secureUserId, productId, quantity));
    }

    @PutMapping("/items")
    public ResponseEntity<Cart> updateItemQuantity(
            @RequestParam(required = false) UUID userId,
            @RequestParam UUID productId,
            @RequestParam BigDecimal quantity) {
        UUID secureUserId = getSecureUserId();
        return ResponseEntity.ok(cartService.updateCartItemQuantity(secureUserId, productId, quantity));
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<Cart> removeItemFromCart(
            @RequestParam(required = false) UUID userId,
            @PathVariable UUID productId) {
        UUID secureUserId = getSecureUserId();
        return ResponseEntity.ok(cartService.removeItemFromCart(secureUserId, productId));
    }

    @DeleteMapping
    public ResponseEntity<?> clearCart(@RequestParam(required = false) UUID userId) {
        UUID secureUserId = getSecureUserId();
        cartService.clearCart(secureUserId);
        return ResponseEntity.ok("Cart cleared successfully");
    }
}
