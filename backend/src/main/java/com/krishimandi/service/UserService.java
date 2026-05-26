package com.krishimandi.service;

import com.krishimandi.dto.LoginRequest;
import com.krishimandi.dto.LoginResponse;
import com.krishimandi.dto.RegisterRequest;
import com.krishimandi.entity.*;
import com.krishimandi.exception.BadRequestException;
import com.krishimandi.repository.CartRepository;
import com.krishimandi.repository.FarmerRepository;
import com.krishimandi.repository.UserRepository;
import com.krishimandi.repository.VendorRepository;
import com.krishimandi.security.JwtTokenProvider;
import com.krishimandi.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FarmerRepository farmerRepository;

    @Autowired
    private VendorRepository vendorRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private com.krishimandi.repository.VerificationTokenRepository tokenRepository;

    @Autowired
    private EmailService emailService;

    private String generateOTP() {
        java.util.Random random = new java.util.Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    @Transactional
    public User registerUser(RegisterRequest signUpRequest) {
        if (!signUpRequest.getEmail().endsWith("@gmail.com")) {
            throw new BadRequestException("Only Gmail accounts are allowed.");
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new BadRequestException("Error: Email is already in use!");
        }

        if (userRepository.existsByPhone(signUpRequest.getPhone())) {
            throw new BadRequestException("Error: Phone number is already in use!");
        }

        // Create new user's account
        User user = User.builder()
                .name(signUpRequest.getName())
                .email(signUpRequest.getEmail())
                .password(encoder.encode(signUpRequest.getPassword()))
                .phone(signUpRequest.getPhone())
                .role(signUpRequest.getRole())
                .address(signUpRequest.getAddress())
                .latitude(signUpRequest.getLatitude() != null ? signUpRequest.getLatitude() : 12.9716) // Default to Bangalore
                .longitude(signUpRequest.getLongitude() != null ? signUpRequest.getLongitude() : 77.5946)
                .avatarUrl("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150") // Placeholder avatar
                .active(true)
                .isVerified(false) // Needs Gmail OTP Verification
                .build();

        User savedUser = userRepository.save(user);

        // Create role specific records
        if (signUpRequest.getRole() == Role.FARMER) {
            Farmer farmer = Farmer.builder()
                    .user(savedUser)
                    .farmName(signUpRequest.getFarmName() != null ? signUpRequest.getFarmName() : signUpRequest.getName() + "'s Farm")
                    .farmSizeAcres(signUpRequest.getFarmSizeAcres())
                    .verified(false) // Needs Admin verification
                    .build();
            farmerRepository.save(farmer);
        } else if (signUpRequest.getRole() == Role.VENDOR) {
            Vendor vendor = Vendor.builder()
                    .user(savedUser)
                    .shopName(signUpRequest.getShopName() != null ? signUpRequest.getShopName() : signUpRequest.getName() + "'s Shop")
                    .shopType(signUpRequest.getShopType() != null ? signUpRequest.getShopType() : "Street Stall")
                    .monthlySpendLimit(signUpRequest.getMonthlySpendLimit())
                    .build();
            vendorRepository.save(vendor);

            // Vendors get a Cart initialized automatically!
            Cart cart = Cart.builder()
                    .user(savedUser)
                    .build();
            cartRepository.save(cart);
        }

        // Generate OTP and save VerificationToken
        String otp = generateOTP();
        VerificationToken verificationToken = VerificationToken.builder()
                .user(savedUser)
                .token(otp)
                .expiryTime(java.time.ZonedDateTime.now().plusMinutes(15))
                .build();
        tokenRepository.save(verificationToken);

        // Send Email
        emailService.sendVerificationEmail(savedUser.getEmail(), otp);

        return savedUser;
    }

    public LoginResponse authenticateUser(LoginRequest loginRequest) {
        String loginEmail = loginRequest.getEmail();
        String loginPassword = loginRequest.getPassword();

        if (loginEmail.contains("@") && !loginEmail.endsWith("@gmail.com")) {
            throw new BadRequestException("Only Gmail accounts are allowed.");
        }

        User user = userRepository.findByEmail(loginEmail)
                .orElseThrow(() -> new BadRequestException("Error: Invalid email or password."));

        if (user.getIsVerified() != null && !user.getIsVerified()) {
            throw new BadRequestException("Please verify your Gmail account first.");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginEmail, loginPassword));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtTokenProvider.generateToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        UUID detailsId = null;
        Boolean verified = null;

        if (userDetails.getRole().equals(Role.FARMER.name())) {
            Farmer farmer = farmerRepository.findByUserId(userDetails.getId()).orElse(null);
            if (farmer != null) {
                detailsId = farmer.getId();
                verified = farmer.getVerified();
            }
        } else if (userDetails.getRole().equals(Role.VENDOR.name())) {
            Vendor vendor = vendorRepository.findByUserId(userDetails.getId()).orElse(null);
            if (vendor != null) {
                detailsId = vendor.getId();
            }
        }

        return LoginResponse.builder()
                .token(jwt)
                .userId(userDetails.getId())
                .name(userDetails.getName())
                .email(userDetails.getEmail())
                .phone(userDetails.getPhone())
                .role(Role.valueOf(userDetails.getRole()))
                .address(user.getAddress())
                .latitude(user.getLatitude())
                .longitude(user.getLongitude())
                .avatarUrl(user.getAvatarUrl())
                .detailsId(detailsId)
                .verified(verified)
                .build();
    }

    @Transactional
    public void verifyOtp(String email, String otp) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found with this email."));

        if (user.getIsVerified() != null && user.getIsVerified()) {
            return; // Already verified
        }

        VerificationToken verificationToken = tokenRepository.findByToken(otp)
                .orElseThrow(() -> new BadRequestException("Invalid verification OTP."));

        if (!verificationToken.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Invalid verification OTP.");
        }

        if (verificationToken.getExpiryTime().isBefore(java.time.ZonedDateTime.now())) {
            throw new BadRequestException("Verification OTP has expired. Please request a new one.");
        }

        // Mark user as verified
        user.setIsVerified(true);
        userRepository.save(user);

        // Delete used token
        tokenRepository.delete(verificationToken);
    }

    @Transactional
    public void resendVerification(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found with this email."));

        if (user.getIsVerified() != null && user.getIsVerified()) {
            throw new BadRequestException("This account is already verified.");
        }

        // Rate limiting checks: if a token exists and was created less than 1 minute ago, reject
        java.util.Optional<VerificationToken> existingTokenOpt = tokenRepository.findByUser(user);
        if (existingTokenOpt.isPresent()) {
            VerificationToken existing = existingTokenOpt.get();
            java.time.ZonedDateTime limitTime = existing.getCreatedAt().plusMinutes(1);
            if (limitTime.isAfter(java.time.ZonedDateTime.now())) {
                throw new BadRequestException("Please wait 1 minute before requesting a new OTP.");
            }
            // Delete old token
            tokenRepository.delete(existing);
        }

        // Generate new OTP
        String otp = generateOTP();
        VerificationToken verificationToken = VerificationToken.builder()
                .user(user)
                .token(otp)
                .expiryTime(java.time.ZonedDateTime.now().plusMinutes(15))
                .build();
        tokenRepository.save(verificationToken);

        // Send Email
        emailService.sendVerificationEmail(user.getEmail(), otp);
    }



    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public User toggleUserStatus(UUID id, boolean active) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("User not found"));
        user.setActive(active);
        return userRepository.save(user);
    }

    @Transactional
    public Farmer verifyFarmer(UUID id, boolean verify) {
        Farmer farmer = farmerRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Farmer not found"));
        farmer.setVerified(verify);
        return farmerRepository.save(farmer);
    }

    @Transactional
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found with this email."));

        // Generate a secure reset token (UUID)
        String resetToken = UUID.randomUUID().toString();
        
        // Set token expiry to 24 hours from now
        user.setPasswordResetToken(resetToken);
        user.setPasswordResetTokenExpiry(java.time.ZonedDateTime.now().plusHours(24));
        userRepository.save(user);

        // Send password reset email
        emailService.sendPasswordResetEmail(user.getEmail(), resetToken);
    }

    @Transactional
    public void resetPassword(String token, String newPassword, String confirmPassword) {
        if (!newPassword.equals(confirmPassword)) {
            throw new BadRequestException("Passwords do not match.");
        }

        if (newPassword.length() < 6) {
            throw new BadRequestException("Password must be at least 6 characters long.");
        }

        User user = userRepository.findByPasswordResetToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid password reset token."));

        // Check if token is expired
        if (user.getPasswordResetTokenExpiry() == null || user.getPasswordResetTokenExpiry().isBefore(java.time.ZonedDateTime.now())) {
            throw new BadRequestException("Password reset token has expired. Please request a new one.");
        }

        // Update password (encrypt it)
        user.setPassword(encoder.encode(newPassword));
        user.setPasswordResetToken(null);
        user.setPasswordResetTokenExpiry(null);
        userRepository.save(user);
    }
}
