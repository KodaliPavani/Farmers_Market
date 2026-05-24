package com.krishimandi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Async
    public void sendVerificationEmail(String toEmail, String token) {
        String subject = "KrishiMandi - Verify Your Gmail Account";
        String messageText = "Namaste!\n\n" +
                "Thank you for registering on KrishiMandi. To secure your B2B sourcing portal, please verify your Gmail account using the OTP below:\n\n" +
                "Your Verification OTP: " + token + "\n\n" +
                "This OTP is valid for 15 minutes.\n\n" +
                "If you did not request this verification, you can ignore this email.\n\n" +
                "Warm regards,\n" +
                "Team KrishiMandi";

        if (mailSender != null) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(toEmail);
                message.setSubject(subject);
                message.setText(messageText);
                mailSender.send(message);
                System.out.println("Verification email successfully sent to " + toEmail);
            } catch (Exception e) {
                System.err.println("Failed to send verification email via JavaMailSender: " + e.getMessage());
                // Fallback printing in console so development testing isn't blocked by credential issues
                System.out.println("\n--- [DEVELOPMENT FALLBACK - VERIFICATION OTP] ---");
                System.out.println("TO: " + toEmail);
                System.out.println("OTP: " + token);
                System.out.println("-------------------------------------------------\n");
            }
        } else {
            System.out.println("JavaMailSender is not configured. Fallback to console output:");
            System.out.println("\n--- [MOCK EMAIL CONSOLE - VERIFICATION OTP] ---");
            System.out.println("TO: " + toEmail);
            System.out.println("OTP: " + token);
            System.out.println("-----------------------------------------------\n");
        }
    }

    @Async
    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        String subject = "KrishiMandi - Reset Your Password";
        String resetLink = "http://localhost:5173/reset-password?token=" + resetToken;
        String messageText = "Namaste!\n\n" +
                "We received a request to reset your password. Click the link below to set a new password:\n\n" +
                "Reset Link: " + resetLink + "\n\n" +
                "This link is valid for 24 hours.\n\n" +
                "If you did not request a password reset, you can ignore this email. Your password will remain unchanged.\n\n" +
                "Warm regards,\n" +
                "Team KrishiMandi";

        if (mailSender != null) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(toEmail);
                message.setSubject(subject);
                message.setText(messageText);
                mailSender.send(message);
                System.out.println("Password reset email successfully sent to " + toEmail);
            } catch (Exception e) {
                System.err.println("Failed to send password reset email via JavaMailSender: " + e.getMessage());
                System.out.println("\n--- [DEVELOPMENT FALLBACK - PASSWORD RESET TOKEN] ---");
                System.out.println("TO: " + toEmail);
                System.out.println("RESET TOKEN: " + resetToken);
                System.out.println("RESET LINK: " + resetLink);
                System.out.println("---------------------------------------------------\n");
            }
        } else {
            System.out.println("JavaMailSender is not configured. Fallback to console output:");
            System.out.println("\n--- [MOCK EMAIL CONSOLE - PASSWORD RESET TOKEN] ---");
            System.out.println("TO: " + toEmail);
            System.out.println("RESET TOKEN: " + resetToken);
            System.out.println("RESET LINK: " + resetLink);
            System.out.println("--------------------------------------------------\n");
        }
    }
}
