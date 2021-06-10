package com.example.demo.service;

import com.example.demo.exception.BadRequestException;
import com.example.demo.model.User;
import com.example.demo.payload.PagedResponse;
import com.example.demo.payload.UserResponse;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.UserPrincipal;
import com.example.demo.util.AppConstants;
import com.example.demo.util.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    MailSender mailSender;

    @Autowired
    PasswordEncoder passwordEncoder;

    public PagedResponse<UserResponse> getAllUsers(UserPrincipal currentUser, int page, int size) {
        validatePageNumberAndSize(page, size);

        // Retrieve Users
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "email");
        Page<User> users = userRepository.findAll(pageable);

        if(users.getNumberOfElements() == 0) {
            return new PagedResponse<>(Collections.emptyList(), users.getNumber(),
                    users.getSize(), users.getTotalElements(), users.getTotalPages(), users.isLast());
        }

        List<UserResponse> userResponses = users.map(ModelMapper::mapUserToUserResponse).getContent();

        return new PagedResponse<>(userResponses, users.getNumber(),
                users.getSize(), users.getTotalElements(), users.getTotalPages(), users.isLast());
    }

    public List<User> getAllUsersForChat(UserPrincipal currentUser) {
        return userRepository.findAllContact(currentUser.getId());
    }

    private void validatePageNumberAndSize(int page, int size) {
        if(page < 0) {
            throw new BadRequestException("Page number cannot be less than zero.");
        }

        if(size > AppConstants.MAX_PAGE_SIZE) {
            throw new BadRequestException("Page size must not be greater than " + AppConstants.MAX_PAGE_SIZE);
        }
    }

    public boolean activateUser(String code) {
        User user = userRepository.findByActivationCode(code);
        if (user == null){
            return false;
        }
        user.setActivationCode(null);
        user.setIsActive(true);
        userRepository.save(user);
        return true;
    }

    public void resetPassword(User user){
        user.setResetPassword(UUID.randomUUID().toString());
        String message = String.format(
                "Привет, " + user.getUsername() + ".\n" +
                        "Для сброса пароля перейдите по ссылке - "  + System.getenv("FRONTEND") + "/api/resetPassword/" +
                        user.getResetPassword()
        );
        mailSender.send(user.getEmail(), "Сброс пароля", message);
        userRepository.save(user);
    }

    public void inputPassword(User user, String password){
        user.setPassword(passwordEncoder.encode(password));
        user.setResetPassword(null);
        userRepository.save(user);
    }
}
