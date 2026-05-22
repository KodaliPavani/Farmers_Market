package com.krishimandi.repository;

import com.krishimandi.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MessageRepository extends JpaRepository<Message, UUID> {

    @Query("SELECT m FROM Message m WHERE (m.sender.id = :user1 AND m.receiver.id = :user2) " +
           "OR (m.sender.id = :user2 AND m.receiver.id = :user1) " +
           "ORDER BY m.createdAt ASC")
    List<Message> findChatHistory(@Param("user1") UUID user1, @Param("user2") UUID user2);

    @Query("SELECT DISTINCT m.sender.id FROM Message m WHERE m.receiver.id = :userId")
    List<UUID> findActiveChatUserIds(@Param("userId") UUID userId);
}
