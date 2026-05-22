package com.krishimandi.service;

import com.krishimandi.entity.Message;
import com.krishimandi.entity.User;
import com.krishimandi.exception.ResourceNotFoundException;
import com.krishimandi.repository.MessageRepository;
import com.krishimandi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.HashSet;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Message> getChatHistory(UUID user1, UUID user2) {
        return messageRepository.findChatHistory(user1, user2);
    }

    @Transactional
    public Message sendMessage(UUID senderId, UUID receiverId, String content) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new ResourceNotFoundException("Receiver not found"));

        Message message = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .content(content)
                .build();

        return messageRepository.save(message);
    }

    public List<User> getActiveChats(UUID userId) {
        List<UUID> activeChatUserIds = messageRepository.findActiveChatUserIds(userId);
        
        // Also get user ids where current user is the sender (outgoing conversations)
        List<Message> allMessages = messageRepository.findAll();
        Set<UUID> counterpartyIds = new HashSet<>();
        
        for (Message m : allMessages) {
            if (m.getSender().getId().equals(userId)) {
                counterpartyIds.add(m.getReceiver().getId());
            } else if (m.getReceiver().getId().equals(userId)) {
                counterpartyIds.add(m.getSender().getId());
            }
        }
        
        return userRepository.findAllById(counterpartyIds);
    }
}
