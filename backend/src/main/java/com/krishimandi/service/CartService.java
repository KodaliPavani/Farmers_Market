package com.krishimandi.service;

import com.krishimandi.entity.Cart;
import com.krishimandi.entity.CartItem;
import com.krishimandi.entity.Product;
import com.krishimandi.entity.User;
import com.krishimandi.exception.ResourceNotFoundException;
import com.krishimandi.repository.CartItemRepository;
import com.krishimandi.repository.CartRepository;
import com.krishimandi.repository.ProductRepository;
import com.krishimandi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public Cart getCartByUser(UUID userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                    Cart cart = Cart.builder().user(user).build();
                    return cartRepository.save(cart);
                });
    }

    @Transactional
    public Cart addItemToCart(UUID userId, UUID productId, BigDecimal quantity) {
        Cart cart = getCartByUser(userId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        Optional<CartItem> existingItemOpt = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId);

        if (existingItemOpt.isPresent()) {
            CartItem item = existingItemOpt.get();
            item.setQuantity(item.getQuantity().add(quantity));
            cartItemRepository.save(item);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(quantity)
                    .build();
            cartItemRepository.save(newItem);
        }

        return getCartByUser(userId); // Return refreshed cart
    }

    @Transactional
    public Cart updateCartItemQuantity(UUID userId, UUID productId, BigDecimal quantity) {
        Cart cart = getCartByUser(userId);
        CartItem item = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (quantity.compareTo(BigDecimal.ZERO) <= 0) {
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }

        return getCartByUser(userId);
    }

    @Transactional
    public Cart removeItemFromCart(UUID userId, UUID productId) {
        Cart cart = getCartByUser(userId);
        CartItem item = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        cartItemRepository.delete(item);
        return getCartByUser(userId);
    }

    @Transactional
    public void clearCart(UUID userId) {
        Cart cart = getCartByUser(userId);
        cart.getItems().clear();
        cartRepository.save(cart);
    }
}
