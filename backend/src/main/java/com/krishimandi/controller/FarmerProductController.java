package com.krishimandi.controller;

import com.krishimandi.entity.Category;
import com.krishimandi.entity.Farmer;
import com.krishimandi.entity.Product;
import com.krishimandi.exception.BadRequestException;
import com.krishimandi.exception.ResourceNotFoundException;
import com.krishimandi.repository.CategoryRepository;
import com.krishimandi.repository.FarmerRepository;
import com.krishimandi.repository.ProductRepository;
import com.krishimandi.security.UserDetailsImpl;
import com.krishimandi.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/farmer/products")
@PreAuthorize("hasRole('FARMER')")
public class FarmerProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private FarmerRepository farmerRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    private Farmer getAuthenticatedFarmer() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetailsImpl) {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            return farmerRepository.findByUserId(userDetails.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Farmer profile not found for authenticated user"));
        }
        throw new BadRequestException("Unauthorized access: User details not found in context");
    }

    // 1. Add Product
    // POST /farmer/products
    @PostMapping
    public ResponseEntity<?> addProduct(@RequestBody Map<String, Object> body) {
        Farmer farmer = getAuthenticatedFarmer();

        String name = (String) body.get("name");
        String description = (String) body.get("description");
        
        BigDecimal price;
        try {
            price = new BigDecimal(body.get("price").toString());
            if (price.compareTo(BigDecimal.ZERO) <= 0) {
                throw new BadRequestException("Price must be greater than zero.");
            }
        } catch (Exception e) {
            throw new BadRequestException("Invalid or missing price.");
        }

        BigDecimal stockQuantity;
        try {
            stockQuantity = new BigDecimal(body.get("stockQuantity").toString());
            if (stockQuantity.compareTo(BigDecimal.ZERO) < 0) {
                throw new BadRequestException("Stock quantity cannot be negative.");
            }
        } catch (Exception e) {
            throw new BadRequestException("Invalid or missing stock quantity.");
        }

        String unit = (String) body.get("unit");
        String imageUrl = (String) body.get("imageUrl");
        String freshnessStatus = (String) body.get("freshnessStatus");

        String categoryIdStr = (String) body.get("categoryId");
        if (categoryIdStr == null) {
            // Find or fallback to default category (Fresh Vegetables)
            List<Category> categories = categoryRepository.findAll();
            if (!categories.isEmpty()) {
                categoryIdStr = categories.get(0).getId().toString();
            } else {
                throw new ResourceNotFoundException("No categories exist in database.");
            }
        }

        UUID categoryId = UUID.fromString(categoryIdStr);
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Product product = Product.builder()
                .farmer(farmer)
                .category(category)
                .name(name)
                .description(description)
                .price(price)
                .stockQuantity(stockQuantity)
                .unit(unit != null ? unit : "KG")
                .imageUrl(imageUrl)
                .harvestDate(java.time.LocalDate.now())
                .freshnessDays(7)
                .freshnessStatus(freshnessStatus != null ? freshnessStatus : "Excellent")
                .build();

        Product savedProduct = productRepository.save(product);
        return ResponseEntity.ok(savedProduct);
    }

    // 2. Get Logged-in Farmer Products
    // GET /farmer/products
    @GetMapping
    public ResponseEntity<List<Product>> getMyProducts() {
        Farmer farmer = getAuthenticatedFarmer();
        List<Product> products = productRepository.findByFarmerId(farmer.getId());
        return ResponseEntity.ok(products);
    }

    // 3. Get Single Product
    // GET /farmer/products/{id}
    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable UUID id) {
        Farmer farmer = getAuthenticatedFarmer();
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // Security requirement: Farmer can ONLY view their own products
        if (!product.getFarmer().getId().equals(farmer.getId())) {
            throw new BadRequestException("Access denied: You do not own this product.");
        }

        return ResponseEntity.ok(product);
    }

    // 4. Update Product
    // PUT /farmer/products/{id}
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable UUID id, @RequestBody Map<String, Object> body) {
        Farmer farmer = getAuthenticatedFarmer();
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // Security requirement: Farmer can ONLY edit their own products
        if (!product.getFarmer().getId().equals(farmer.getId())) {
            throw new BadRequestException("Access denied: You do not own this product.");
        }

        if (body.containsKey("name")) product.setName((String) body.get("name"));
        if (body.containsKey("description")) product.setDescription((String) body.get("description"));
        
        if (body.containsKey("price")) {
            BigDecimal price = new BigDecimal(body.get("price").toString());
            if (price.compareTo(BigDecimal.ZERO) <= 0) {
                throw new BadRequestException("Price must be greater than zero.");
            }
            product.setPrice(price);
        }

        if (body.containsKey("stockQuantity")) {
            BigDecimal stockQuantity = new BigDecimal(body.get("stockQuantity").toString());
            if (stockQuantity.compareTo(BigDecimal.ZERO) < 0) {
                throw new BadRequestException("Stock quantity cannot be negative.");
            }
            product.setStockQuantity(stockQuantity);
        }

        if (body.containsKey("unit")) product.setUnit((String) body.get("unit"));
        if (body.containsKey("imageUrl")) product.setImageUrl((String) body.get("imageUrl"));
        if (body.containsKey("freshnessStatus")) product.setFreshnessStatus((String) body.get("freshnessStatus"));

        if (body.containsKey("categoryId")) {
            UUID categoryId = UUID.fromString(body.get("categoryId").toString());
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            product.setCategory(category);
        }

        Product updatedProduct = productRepository.save(product);
        return ResponseEntity.ok(updatedProduct);
    }

    // 5. Delete Product
    // DELETE /farmer/products/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable UUID id) {
        Farmer farmer = getAuthenticatedFarmer();
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // Security requirement: Farmer can ONLY delete their own products
        if (!product.getFarmer().getId().equals(farmer.getId())) {
            throw new BadRequestException("Access denied: You do not own this product.");
        }

        productRepository.delete(product);
        return ResponseEntity.ok(new HashMap<String, String>() {{
            put("message", "Product deleted successfully");
        }});
    }

    // 6. Update Stock
    // PATCH /farmer/products/{id}/stock
    @PatchMapping("/{id}/stock")
    public ResponseEntity<?> updateStock(@PathVariable UUID id, @RequestBody Map<String, Object> body) {
        Farmer farmer = getAuthenticatedFarmer();
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // Security requirement: Farmer can ONLY edit their own products
        if (!product.getFarmer().getId().equals(farmer.getId())) {
            throw new BadRequestException("Access denied: You do not own this product.");
        }

        if (!body.containsKey("stockQuantity")) {
            throw new BadRequestException("Missing stockQuantity parameter.");
        }

        BigDecimal stockQuantity = new BigDecimal(body.get("stockQuantity").toString());
        if (stockQuantity.compareTo(BigDecimal.ZERO) < 0) {
            throw new BadRequestException("Stock quantity cannot be negative.");
        }

        product.setStockQuantity(stockQuantity);
        Product updatedProduct = productRepository.save(product);
        return ResponseEntity.ok(updatedProduct);
    }
}
