package com.example.demo.controller;

import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Item;
import com.example.demo.model.Review;
import com.example.demo.model.User;
import com.example.demo.payload.*;
import com.example.demo.repository.ReviewRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.CurrentUser;
import com.example.demo.security.UserPrincipal;
import com.example.demo.service.ReviewService;
import com.example.demo.util.AppConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/reviews/{username}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> createReview(@CurrentUser UserPrincipal currentUser, @Valid @RequestBody ReviewRequest reviewRequest, @PathVariable String username) {
        return reviewService.createReview(currentUser, username, reviewRequest);
    }

    @PutMapping("/reviews/{username}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> updateReview(@CurrentUser UserPrincipal currentUser, @Valid @RequestBody ReviewRequest reviewRequest, @PathVariable String username) {
        return reviewService.updateReview(currentUser, username, reviewRequest);
    }

    @GetMapping("/reviews/{username}")
    public FullReviewResponse getAllReviews(@PathVariable String username) {
        return reviewService.getAllReviews(username);
    }

    @GetMapping("/review/{username}")
    public ReviewResponse getMyReview(@CurrentUser UserPrincipal currentUser, @PathVariable String username) {
        return reviewService.getMyReview(currentUser, username);
    }
}
