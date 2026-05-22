package com.krishimandi.dto;

import com.krishimandi.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class RegisterRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Phone is required")
    private String phone;

    @NotNull(message = "Role is required")
    private Role role;

    private String address;
    private Double latitude;
    private Double longitude;

    // Farmer-specific fields
    private String farmName;
    private BigDecimal farmSizeAcres;

    // Vendor-specific fields
    private String shopName;
    private String shopType;
    private BigDecimal monthlySpendLimit;
}
