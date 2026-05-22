package com.krishimandi.controller;

import com.krishimandi.dto.LoginRequest;
import com.krishimandi.dto.LoginResponse;
import com.krishimandi.dto.RegisterRequest;
import com.krishimandi.entity.Farmer;
import com.krishimandi.entity.User;
import com.krishimandi.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        User user = userService.registerUser(signUpRequest);
        return ResponseEntity.ok("User registered successfully of role: " + user.getRole());
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        LoginResponse response = userService.authenticateUser(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestParam(required = false) String email, 
                                       @RequestParam(required = false) String otp,
                                       @RequestBody(required = false) java.util.Map<String, String> body) {
        String targetEmail = email;
        String targetOtp = otp;
        if (body != null) {
            if (targetEmail == null) targetEmail = body.get("email");
            if (targetOtp == null) targetOtp = body.get("otp");
        }
        if (targetEmail == null || targetOtp == null) {
            return ResponseEntity.badRequest().body("Email and OTP are required.");
        }
        userService.verifyOtp(targetEmail, targetOtp);
        return ResponseEntity.ok(new java.util.HashMap<String, String>() {{
            put("message", "Email verified successfully! You can now log in.");
        }});
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerification(@RequestParam(required = false) String email,
                                                @RequestBody(required = false) java.util.Map<String, String> body) {
        String targetEmail = email;
        if (body != null && targetEmail == null) {
            targetEmail = body.get("email");
        }
        if (targetEmail == null) {
            return ResponseEntity.badRequest().body("Email is required.");
        }
        userService.resendVerification(targetEmail);
        return ResponseEntity.ok(new java.util.HashMap<String, String>() {{
            put("message", "Verification OTP has been resent to your Gmail account.");
        }});
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/users/{id}/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> toggleUserStatus(@PathVariable UUID id, @RequestParam boolean active) {
        User user = userService.toggleUserStatus(id, active);
        return ResponseEntity.ok("User status updated successfully to active=" + user.getActive());
    }

    @PutMapping("/farmers/{id}/verify")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> verifyFarmer(@PathVariable UUID id, @RequestParam boolean verify) {
        Farmer farmer = userService.verifyFarmer(id, verify);
        return ResponseEntity.ok("Farmer verification status set to verified=" + farmer.getVerified());
    }
}
