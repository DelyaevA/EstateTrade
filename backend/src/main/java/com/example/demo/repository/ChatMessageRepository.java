package com.example.demo.repository;

import com.example.demo.model.ChatMessage;
import com.example.demo.model.MessageStatus;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface ChatMessageRepository extends CrudRepository<ChatMessage, String> {
    long countBySenderIdAndRecipientIdAndStatus(
            String senderId, String recipientId, MessageStatus status);

    List<ChatMessage> findByChatId(String chatId);

    List<ChatMessage> findBySenderIdAndRecipientId(String senderId, String recipientId);

    long countByRecipientIdAndStatus(String recipientId, MessageStatus status);
}
