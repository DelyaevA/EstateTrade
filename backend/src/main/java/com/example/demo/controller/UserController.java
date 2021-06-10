package com.example.demo.controller;

import com.example.demo.exception.AppException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.*;
import com.example.demo.payload.*;
import com.example.demo.repository.ChatMessageRepository;
import com.example.demo.repository.ItemRepository;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.CurrentUser;
import com.example.demo.security.UserPrincipal;
import com.example.demo.service.AuctionService;
import com.example.demo.service.ItemService;
import com.example.demo.service.UserService;
import com.example.demo.util.AppConstants;
import com.example.demo.util.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.method.P;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.websocket.server.PathParam;
import java.net.URI;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private ItemService itemService;

    @Autowired
    private AuctionService auctionService;


    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @GetMapping("/users/me")
    @PreAuthorize("hasRole('ROLE_USER')")
    public UserSummary getCurrentUser(@CurrentUser UserPrincipal currentUser) {
        User user = userRepository.getOne(currentUser.getId());

        Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN)
                .orElseThrow(() -> new AppException("User Role not found."));

        Set<Role> userRoles = user.getRoles();

        long isAdmin = 0;
        if (userRoles.contains(adminRole)) {
            isAdmin = 1;
        }

        long countUnreadMessages = chatMessageRepository.countByRecipientIdAndStatus(user.getId(), MessageStatus.RECEIVED);
        return new UserSummary(currentUser.getId(), currentUser.getUsername(), isAdmin, user.getLogo(), countUnreadMessages);
    }

    @GetMapping("/activate/{code}")
    public ResponseEntity<?> activateUser(@PathVariable String code){
        boolean isActivate = userService.activateUser(code);
        if (isActivate){
            return new ResponseEntity<>(new ApiResponse(true, "User activate successfully"), HttpStatus.OK);
        }
        else
            return new ResponseEntity<>(new ApiResponse(true, "Activation code is not found!"), HttpStatus.CONFLICT);
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public PagedResponse<UserResponse> getAllUsers(@CurrentUser UserPrincipal currentUser,
                                                   @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
                                                   @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        return userService.getAllUsers(currentUser, page, size);
    }

    @GetMapping("/users/{username}")
    public UserResponse getUserProfile(@PathVariable(value = "username") String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        return new UserResponse(user.getId(), user.getUsername(), user.getEmail(), user.getLogo());
    }

    @GetMapping("/users2/{id}")
    public ResponseEntity<?> getUserById(@PathVariable(value = "id") String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping("/users/summaries")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> getUserSummaries(@CurrentUser UserPrincipal currentUser) {


        return ResponseEntity.ok(userService
                .getAllUsersForChat(currentUser)
                .stream()
                .filter(user -> !user.getUsername().equals(currentUser.getUsername()))
                .map(this::convertTo));
    }

    @PutMapping("/users")
    public ResponseEntity<?> updateUser(@RequestBody UserUpdateRequest userRequest) {
        User user = userRepository.findByUsername(userRequest.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", userRequest.getUsername()));

        if (!userRequest.getPassword().isEmpty())
            user.setPassword(userRequest.getPassword());

        User result = userRepository.save(user);
        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath().path("/api/users/{username}")
                .buildAndExpand(result.getUsername()).toUri();

        return ResponseEntity.created(location).body(new ApiResponse(true, "User updated successfully"));
    }

    @PutMapping("/resetPassword/{usernameOrEmail}")
    public ResponseEntity<?> resetPassword(@PathVariable("usernameOrEmail") String usernameOrEmail){
        User user = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "usernameOrEmail", usernameOrEmail));
        userService.resetPassword(user);
        return new ResponseEntity<>(new ApiResponse(true, "Код для смены пароля отправлен на вашу почту!"), HttpStatus.OK);
    }

    @PutMapping("/resetPassword")
    public ResponseEntity<?> inputPassword(@RequestBody ResetPasswordRequest password){
        User user = userRepository.findByResetPassword(password.getCode());
        userService.inputPassword(user, password.getPassword());
        return new ResponseEntity<>(new ApiResponse(true, "Код для смены пароля отправлен на вашу почту!"), HttpStatus.OK);
    }

    @DeleteMapping("/admin/users/{username}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> delete(@PathVariable String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        userRepository.delete(user);
        return new ResponseEntity<>(new ApiResponse(true, "User deleted successfully"), HttpStatus.OK);
    }

    @GetMapping("/admin/users/{username}")
    public UserResponse getFullUserProfile(@PathVariable(value = "username") String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        Set<Role> userRoles = user.getRoles();

        Role bannedRole = roleRepository.findByName(RoleName.ROLE_BANNED)
                .orElseThrow(() -> new AppException("User Role not found."));

        return new UserResponse(user.getId(), user.getUsername(), user.getEmail(), user.getLogo(), userRoles.contains(bannedRole), user.getReports());
    }

    @GetMapping("/users/{username}/makeAdmin")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> makeAdmin(@PathVariable String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN)
                .orElseThrow(() -> new AppException("User Role not found."));

        Set<Role> userRoles = user.getRoles();
        userRoles.add(adminRole);
        user.setRoles(userRoles);

        userRepository.save(user);

        return new ResponseEntity<>(new ApiResponse(true, "User has been gotten admin role"), HttpStatus.OK);
    }

    @PutMapping("/admin/users/{username}/ban")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> banUser(@PathVariable String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        Role bannedRole = roleRepository.findByName(RoleName.ROLE_BANNED)
                .orElseThrow(() -> new AppException("User Role not found."));

        Set<Role> userRoles = user.getRoles();
        userRoles.clear();
        userRoles.add(bannedRole);
        user.setRoles(userRoles);
        userRepository.save(user);
        return new ResponseEntity<>(new ApiResponse(true, "User has been banned successfully"), HttpStatus.OK);
    }

    @PutMapping("/admin/users/{username}/unban")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> unbanUser(@PathVariable String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
                .orElseThrow(() -> new AppException("User Role not found."));

        Set<Role> userRoles = user.getRoles();
        userRoles.clear();
        userRoles.add(userRole);
        userRepository.save(user);
        return new ResponseEntity<>(new ApiResponse(true, "User has been unbanned successfully"), HttpStatus.OK);
    }

    @PutMapping("/users/me/changePassword")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> changePassword(@CurrentUser UserPrincipal currentUser, @RequestBody ChangePasswordRequest changePasswordRequest) {
        User user = userRepository.findByUsername(currentUser.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", currentUser.getUsername()));

        if (passwordEncoder.matches(changePasswordRequest.getOldPassword(), user.getPassword())) {
            user.setPassword(passwordEncoder.encode(changePasswordRequest.getNewPassword()));
            User result = userRepository.save(user);
            URI location = ServletUriComponentsBuilder
                    .fromCurrentContextPath().path("/api/users/{username}")
                    .buildAndExpand(result.getUsername()).toUri();

            return ResponseEntity.created(location).body(new ApiResponse(true, "Password has been changed successfully"));
        }
        else {
            return new ResponseEntity<>(new ApiResponse(false, "Старые пароли не совпадают"), HttpStatus.BAD_REQUEST);
        }
    }


    @PutMapping("/admin/users/{username}/changeAuthority")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> changeAuthority(@RequestBody ChangeAuthorityRequest changeAuthorityRequest, @PathVariable String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        Role newRole = roleRepository.findByName(RoleName.valueOf(changeAuthorityRequest.getAuthority()))
                .orElseThrow(() -> new AppException("User Role not found."));

        switch (changeAuthorityRequest.getAuthority()) {
            case "ROLE_ADMIN": {
                Set<Role> userRoles = user.getRoles();
                userRoles.add(newRole);
                user.setRoles(userRoles);
                userRepository.save(user);
                break;
            }
            case "ROLE_USER": {
                Set<Role> userRoles = user.getRoles();
                userRoles.clear();
                userRoles.add(newRole);
                user.setRoles(userRoles);
                userRepository.save(user);
                break;
            }
        }

        return new ResponseEntity<>(new ApiResponse(true, "User has been gotten a new authority successfully"), HttpStatus.OK);


    }

    @PutMapping("/users/{username}/changePassword")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest resetPasswordRequest, @PathVariable String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        user.setPassword(passwordEncoder.encode(resetPasswordRequest.getPassword()));
        User result = userRepository.save(user);
        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath().path("/api/users/{username}")
                .buildAndExpand(result.getUsername()).toUri();

        return ResponseEntity.created(location).body(new ApiResponse(true, "Password has been changed successfully"));
    }

    @GetMapping("/users/{username}/items")
    @PreAuthorize("hasRole('ROLE_USER')")
    public PagedResponse<ItemResponse> getItemsCreatedBy(@PathVariable(value = "username") String username,
                                                         @CurrentUser UserPrincipal currentUser,
                                                         @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
                                                         @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        return itemService.getItemsCreatedBy(username, currentUser, page, size);
    }

    @GetMapping("/users/{username}/useritems")
    @PreAuthorize("hasRole('ROLE_USER')")
    public PagedResponse<ItemResponse> getUserItemsCreatedBy(@PathVariable(value = "username") String username,
                                                         @CurrentUser UserPrincipal currentUser,
                                                         @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
                                                         @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        return itemService.getUserItemsCreatedBy(username, currentUser, page, size);
    }

    @GetMapping("/users/{username}/userauctions")
    @PreAuthorize("hasRole('ROLE_USER')")
    public PagedResponse<AuctionResponse> getUserAuctionsCreatedBy(@PathVariable(value = "username") String username,
                                                             @CurrentUser UserPrincipal currentUser,
                                                             @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
                                                             @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        return auctionService.getUserAuctionsCreatedBy(username, currentUser, page, size);
    }

    @GetMapping("/users/{username}/auctions")
    @PreAuthorize("hasRole('ROLE_USER')")
    public PagedResponse<AuctionResponse> getAuctionsCreatedBy(@PathVariable(value = "username") String username,
                                                         @CurrentUser UserPrincipal currentUser,
                                                         @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
                                                         @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        return auctionService.getAuctionsCreatedBy(username, currentUser, page, size);
    }

    private UserSummary convertTo(User user) {
        return UserSummary
                .builder()
                .id(user.getId())
                .username(user.getUsername())
                .avatar(user.getLogo())
                .build();
    }
}
