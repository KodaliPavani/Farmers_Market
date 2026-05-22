package com.krishimandi.dto;

import com.krishimandi.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
    private String token;
    private UUID userId;
    private String name;
    private String email;
    private String phone;
    private Role role;
    private String address;
    private Double latitude;
    private Double longitude;
    private String avatarUrl;
    private UUID detailsId; // Farmer ID or Vendor ID
    private Boolean verified; // Farmer verified status
}
