package com.krishimandi.service;

import com.krishimandi.entity.Category;
import com.krishimandi.entity.Farmer;
import com.krishimandi.entity.Product;
import com.krishimandi.exception.ResourceNotFoundException;
import com.krishimandi.repository.CategoryRepository;
import com.krishimandi.repository.FarmerRepository;
import com.krishimandi.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private FarmerRepository farmerRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(UUID id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    public List<Product> getProductsByCategory(UUID categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    public List<Product> getProductsByFarmer(UUID farmerId) {
        return productRepository.findByFarmerId(farmerId);
    }

    public List<Product> searchProducts(String query) {
        if (query == null || query.trim().isEmpty()) {
            return productRepository.findAll();
        }
        return productRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query);
    }

    @Transactional
    public Product createProduct(Product product, UUID farmerId, UUID categoryId) {
        Farmer farmer = farmerRepository.findById(farmerId)
                .orElseThrow(() -> new ResourceNotFoundException("Farmer not found with id: " + farmerId));
        
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));

        product.setFarmer(farmer);
        product.setCategory(category);
        if (product.getHarvestDate() == null) {
            product.setHarvestDate(LocalDate.now());
        }

        return productRepository.save(product);
    }

    @Transactional
    public Product updateProduct(UUID id, Product productDetails) {
        Product product = getProductById(id);

        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setUnitType(productDetails.getUnitType());
        product.setStockQuantity(productDetails.getStockQuantity());
        
        if (productDetails.getMinimumOrderQuantity() != null) {
            product.setMinimumOrderQuantity(productDetails.getMinimumOrderQuantity());
        }
        if (productDetails.getPricePerKg() != null) {
            product.setPricePerKg(productDetails.getPricePerKg());
        }
        if (productDetails.getPricePerTon() != null) {
            product.setPricePerTon(productDetails.getPricePerTon());
        }
        if (productDetails.getAvailableStock() != null) {
            product.setAvailableStock(productDetails.getAvailableStock());
        }
        
        if (productDetails.getImageUrl() != null) {
            product.setImageUrl(productDetails.getImageUrl());
        }
        
        if (productDetails.getHarvestDate() != null) {
            product.setHarvestDate(productDetails.getHarvestDate());
        }

        if (productDetails.getFreshnessDays() != null) {
            product.setFreshnessDays(productDetails.getFreshnessDays());
        }

        if (productDetails.getFreshnessStatus() != null) {
            product.setFreshnessStatus(productDetails.getFreshnessStatus());
        }

        return productRepository.save(product);
    }

    @Transactional
    public void deleteProduct(UUID id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }
}
