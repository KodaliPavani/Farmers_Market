package com.krishimandi.controller;

import com.krishimandi.entity.Message;
import com.krishimandi.entity.User;
import com.krishimandi.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private MessageService messageService;

    @GetMapping("/history")
    public ResponseEntity<List<Message>> getChatHistory(
            @RequestParam UUID user1,
            @RequestParam UUID user2) {
        return ResponseEntity.ok(messageService.getChatHistory(user1, user2));
    }

    @PostMapping("/send")
    public ResponseEntity<Message> sendMessage(@RequestBody Map<String, Object> payload) {
        UUID senderId = UUID.fromString(payload.get("senderId").toString());
        UUID receiverId = UUID.fromString(payload.get("receiverId").toString());
        String content = payload.get("content").toString();

        return ResponseEntity.ok(messageService.sendMessage(senderId, receiverId, content));
    }

    @GetMapping("/active-chats")
    public ResponseEntity<List<User>> getActiveChats(@RequestParam UUID userId) {
        return ResponseEntity.ok(messageService.getActiveChats(userId));
    }
}
