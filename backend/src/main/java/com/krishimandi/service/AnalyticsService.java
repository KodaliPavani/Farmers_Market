package com.krishimandi.service;

import com.krishimandi.entity.Farmer;
import com.krishimandi.entity.Order;
import com.krishimandi.entity.OrderItem;
import com.krishimandi.entity.OrderStatus;
import com.krishimandi.entity.Vendor;
import com.krishimandi.exception.ResourceNotFoundException;
import com.krishimandi.repository.FarmerRepository;
import com.krishimandi.repository.OrderRepository;
import com.krishimandi.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
public class AnalyticsService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private VendorRepository vendorRepository;

    @Autowired
    private FarmerRepository farmerRepository;

    public Map<String, Object> getFarmerAnalytics(UUID farmerUserId) {
        Farmer farmer = farmerRepository.findByUserId(farmerUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Farmer not found"));

        List<Order> orders = orderRepository.findByFarmerIdOrderByCreatedAtDesc(farmer.getId());

        BigDecimal totalSales = BigDecimal.ZERO;
        int totalOrders = orders.size();
        int pendingOrders = 0;
        int activeOrders = 0;

        Map<String, BigDecimal> productSales = new HashMap<>();
        Map<String, BigDecimal> monthlySales = new LinkedHashMap<>();

        for (Order order : orders) {
            switch (order.getStatus()) {
                case PENDING -> pendingOrders++;
                case ACCEPTED, SHIPPING -> activeOrders++;
                case DELIVERED -> totalSales = totalSales.add(order.getTotalAmount());
            }

            // Product sales mapping
            for (OrderItem item : order.getItems()) {
                String productName = item.getProduct().getName();
                BigDecimal sales = item.getPricePerUnit().multiply(item.getQuantity());
                productSales.put(productName, productSales.getOrDefault(productName, BigDecimal.ZERO).add(sales));
            }

            // Monthly sales mapping
            String month = order.getCreatedAt().getMonth().name().substring(0, 3) + " " + order.getCreatedAt().getYear();
            monthlySales.put(month, monthlySales.getOrDefault(month, BigDecimal.ZERO).add(order.getTotalAmount()));
        }

        // Prepare top products list
        List<Map<String, Object>> topProducts = new ArrayList<>();
        productSales.entrySet().stream()
                .sorted(Map.Entry.<String, BigDecimal>comparingByValue().reversed())
                .limit(5)
                .forEach(entry -> {
                    Map<String, Object> prod = new HashMap<>();
                    prod.put("name", entry.getKey());
                    prod.put("sales", entry.getValue());
                    topProducts.add(prod);
                });

        // Prepare monthly sales list
        List<Map<String, Object>> salesTrend = new ArrayList<>();
        monthlySales.forEach((month, sales) -> {
            Map<String, Object> dataPoint = new HashMap<>();
            dataPoint.put("month", month);
            dataPoint.put("sales", sales);
            salesTrend.add(dataPoint);
        });

        Map<String, Object> result = new HashMap<>();
        result.put("totalSales", totalSales);
        result.put("totalOrders", totalOrders);
        result.put("pendingOrders", pendingOrders);
        result.put("activeOrders", activeOrders);
        result.put("topProducts", topProducts);
        result.put("salesTrend", salesTrend);

        return result;
    }

    public Map<String, Object> getVendorAnalytics(UUID vendorUserId) {
        Vendor vendor = vendorRepository.findByUserId(vendorUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found"));

        List<Order> orders = orderRepository.findByVendorIdOrderByCreatedAtDesc(vendor.getId());

        BigDecimal totalSpend = BigDecimal.ZERO;
        int totalOrders = orders.size();
        int activeOrders = 0;

        Map<String, BigDecimal> categorySpend = new HashMap<>();
        Map<String, BigDecimal> monthlySpend = new LinkedHashMap<>();

        for (Order order : orders) {
            if (order.getStatus() != OrderStatus.CANCELLED && order.getStatus() != OrderStatus.REJECTED) {
                totalSpend = totalSpend.add(order.getTotalAmount());
                if (order.getStatus() != OrderStatus.DELIVERED) {
                    activeOrders++;
                }
            }

            // Category spend mapping
            for (OrderItem item : order.getItems()) {
                String catName = item.getProduct().getCategory() != null ? item.getProduct().getCategory().getName() : "Others";
                BigDecimal spend = item.getPricePerUnit().multiply(item.getQuantity());
                categorySpend.put(catName, categorySpend.getOrDefault(catName, BigDecimal.ZERO).add(spend));
            }

            // Monthly spend mapping
            String month = order.getCreatedAt().getMonth().name().substring(0, 3) + " " + order.getCreatedAt().getYear();
            monthlySpend.put(month, monthlySpend.getOrDefault(month, BigDecimal.ZERO).add(order.getTotalAmount()));
        }

        // Prepare category spending structure
        List<Map<String, Object>> spendByCategory = new ArrayList<>();
        categorySpend.forEach((catName, spend) -> {
            Map<String, Object> cat = new HashMap<>();
            cat.put("category", catName);
            cat.put("spend", spend);
            spendByCategory.add(cat);
        });

        // Prepare monthly spending trend structure
        List<Map<String, Object>> spendTrend = new ArrayList<>();
        monthlySpend.forEach((month, spend) -> {
            Map<String, Object> dataPoint = new HashMap<>();
            dataPoint.put("month", month);
            dataPoint.put("spend", spend);
            spendTrend.add(dataPoint);
        });

        Map<String, Object> result = new HashMap<>();
        result.put("totalSpend", totalSpend);
        result.put("monthlyLimit", vendor.getMonthlySpendLimit());
        result.put("totalOrders", totalOrders);
        result.put("activeOrders", activeOrders);
        result.put("spendByCategory", spendByCategory);
        result.put("spendTrend", spendTrend);

        return result;
    }

    public Map<String, Object> getAdminAnalytics() {
        List<Order> orders = orderRepository.findAll();

        BigDecimal platformRevenue = BigDecimal.ZERO;
        int totalOrders = orders.size();
        
        long totalFarmers = farmerRepository.count();
        long totalVendors = vendorRepository.count();

        Map<String, BigDecimal> monthlyRevenue = new LinkedHashMap<>();

        for (Order order : orders) {
            if (order.getStatus() == OrderStatus.DELIVERED) {
                // Platform fee, let's say 2% of transaction
                BigDecimal platformFee = order.getTotalAmount().multiply(new BigDecimal("0.02"));
                platformRevenue = platformRevenue.add(platformFee);
            }

            String month = order.getCreatedAt().getMonth().name().substring(0, 3) + " " + order.getCreatedAt().getYear();
            monthlyRevenue.put(month, monthlyRevenue.getOrDefault(month, BigDecimal.ZERO).add(order.getTotalAmount()));
        }

        List<Map<String, Object>> revenueTrend = new ArrayList<>();
        monthlyRevenue.forEach((month, transVol) -> {
            Map<String, Object> dataPoint = new HashMap<>();
            dataPoint.put("month", month);
            dataPoint.put("transactionVolume", transVol);
            dataPoint.put("platformEarnings", transVol.multiply(new BigDecimal("0.02")));
            revenueTrend.add(dataPoint);
        });

        Map<String, Object> result = new HashMap<>();
        result.put("platformRevenue", platformRevenue);
        result.put("totalOrders", totalOrders);
        result.put("totalFarmers", totalFarmers);
        result.put("totalVendors", totalVendors);
        result.put("revenueTrend", revenueTrend);

        return result;
    }
}
