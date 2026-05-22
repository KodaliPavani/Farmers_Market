package com.krishimandi.service;

import com.krishimandi.entity.*;
import com.krishimandi.exception.BadRequestException;
import com.krishimandi.exception.ResourceNotFoundException;
import com.krishimandi.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VendorRepository vendorRepository;

    @Autowired
    private FarmerRepository farmerRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CartService cartService;

    @Autowired
    private NotificationService notificationService;

    public List<Order> getOrdersByVendor(UUID vendorUserId) {
        Vendor vendor = vendorRepository.findByUserId(vendorUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found"));
        return orderRepository.findByVendorIdOrderByCreatedAtDesc(vendor.getId());
    }

    public List<Order> getOrdersByFarmer(UUID farmerUserId) {
        Farmer farmer = farmerRepository.findByUserId(farmerUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Farmer not found"));
        return orderRepository.findByFarmerIdOrderByCreatedAtDesc(farmer.getId());
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    public Order getOrderById(UUID orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
    }

    @Transactional
    public List<Order> placeOrder(UUID vendorUserId, String deliveryAddress, Double lat, Double lon, String paymentMethod) {
        Vendor vendor = vendorRepository.findByUserId(vendorUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found"));
        
        Cart cart = cartService.getCartByUser(vendorUserId);
        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Cannot place order with an empty cart");
        }

        // Group cart items by Farmer because B2B orders must be created per-farmer
        Map<Farmer, List<CartItem>> itemsByFarmer = cart.getItems().stream()
                .collect(Collectors.groupingBy(item -> item.getProduct().getFarmer()));

        List<Order> placedOrders = new ArrayList<>();

        for (Map.Entry<Farmer, List<CartItem>> entry : itemsByFarmer.entrySet()) {
            Farmer farmer = entry.getKey();
            List<CartItem> farmerItems = entry.getValue();

            BigDecimal totalAmount = BigDecimal.ZERO;
            List<OrderItem> orderItems = new ArrayList<>();

            Order order = Order.builder()
                    .vendor(vendor)
                    .farmer(farmer)
                    .deliveryAddress(deliveryAddress)
                    .latitude(lat)
                    .longitude(lon)
                    .paymentMethod(paymentMethod)
                    .paymentStatus(PaymentStatus.PENDING)
                    .status(OrderStatus.PENDING)
                    .build();

            for (CartItem cartItem : farmerItems) {
                Product product = cartItem.getProduct();
                
                // Verify stock
                if (product.getStockQuantity().compareTo(cartItem.getQuantity()) < 0) {
                    throw new BadRequestException("Insufficient stock for product: " + product.getName() + 
                            ". Available: " + product.getStockQuantity() + " " + product.getUnit());
                }

                // Deduct stock
                product.setStockQuantity(product.getStockQuantity().subtract(cartItem.getQuantity()));
                productRepository.save(product);

                BigDecimal itemCost = product.getPrice().multiply(cartItem.getQuantity());
                totalAmount = totalAmount.add(itemCost);

                OrderItem orderItem = OrderItem.builder()
                        .order(order)
                        .product(product)
                        .quantity(cartItem.getQuantity())
                        .pricePerUnit(product.getPrice())
                        .build();

                orderItems.add(orderItem);
            }

            order.setTotalAmount(totalAmount);
            order.setItems(orderItems);

            // Apply Advanced Feature: Bulk Order Transport Optimization
            // If another vendor close to this vendor (within 5km) also ordered from the same farmer in the last 24 hours,
            // we optimize transport, marking BOTH orders as bulk-optimized!
            applyBulkOptimizationIfEligible(order);

            Order savedOrder = orderRepository.save(order);
            placedOrders.add(savedOrder);

            // Notify Farmer
            notificationService.createNotification(
                    farmer.getUser(),
                    "New Order Received",
                    "You have received a new order from " + vendor.getShopName() + " worth Rs. " + totalAmount
            );
        }

        // Clear Vendor's cart
        cartService.clearCart(vendorUserId);

        return placedOrders;
    }

    @Transactional
    public Order updateOrderStatus(UUID orderId, OrderStatus status) {
        Order order = getOrderById(orderId);
        order.setStatus(status);

        if (status == OrderStatus.DELIVERED) {
            order.setPaymentStatus(PaymentStatus.PAID);
        }

        Order savedOrder = orderRepository.save(order);

        // Notify Vendor of the update
        notificationService.createNotification(
                order.getVendor().getUser(),
                "Order Status Updated",
                "Your order to " + order.getFarmer().getFarmName() + " is now " + status
        );

        return savedOrder;
    }

    @Transactional
    public Order cancelOrder(UUID orderId, UUID userId) {
        Order order = getOrderById(orderId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Only vendor can cancel if still pending
        if (user.getRole() == Role.VENDOR && order.getStatus() != OrderStatus.PENDING) {
            throw new BadRequestException("Order cannot be cancelled once accepted or shipping");
        }

        order.setStatus(OrderStatus.CANCELLED);
        
        // Restore stock
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setStockQuantity(product.getStockQuantity().add(item.getQuantity()));
            productRepository.save(product);
        }

        Order savedOrder = orderRepository.save(order);

        // Notify appropriate party
        User partyToNotify = (user.getRole() == Role.VENDOR) ? order.getFarmer().getUser() : order.getVendor().getUser();
        notificationService.createNotification(
                partyToNotify,
                "Order Cancelled",
                "Order #" + orderId.toString().substring(0, 8) + " has been cancelled."
        );

        return savedOrder;
    }

    private void applyBulkOptimizationIfEligible(Order newOrder) {
        List<Order> allOrders = orderRepository.findAll();
        double DISTANCE_THRESHOLD_KM = 5.0;

        for (Order existingOrder : allOrders) {
            if (existingOrder.getFarmer().getId().equals(newOrder.getFarmer().getId()) &&
                !existingOrder.getId().equals(newOrder.getId()) &&
                existingOrder.getStatus() == OrderStatus.PENDING) {

                double distance = calculateDistance(
                        newOrder.getLatitude(), newOrder.getLongitude(),
                        existingOrder.getLatitude(), existingOrder.getLongitude()
                );

                if (distance <= DISTANCE_THRESHOLD_KM) {
                    newOrder.setBulkOptimized(true);
                    existingOrder.setBulkOptimized(true);
                    orderRepository.save(existingOrder);
                    
                    // Notify both vendors about delivery cost savings!
                    notificationService.createNotification(
                            newOrder.getVendor().getUser(),
                            "Transport Costs Reduced!",
                            "Your order is grouped with a nearby vendor (" + existingOrder.getVendor().getShopName() + ") buying from the same farmer. You save 40% on shipping!"
                    );
                    notificationService.createNotification(
                            existingOrder.getVendor().getUser(),
                            "Transport Costs Reduced!",
                            "Your order has been grouped with a nearby vendor (" + newOrder.getVendor().getShopName() + ") buying from the same farmer. You save 40% on shipping!"
                    );
                    break;
                }
            }
        }
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        // Haversine formula
        double R = 6371; // Earth's radius in km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
