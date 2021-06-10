package com.example.demo.service;

import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Item;
import com.example.demo.model.Review;
import com.example.demo.model.User;
import com.example.demo.payload.*;
import com.example.demo.repository.ReviewRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.CurrentUser;
import com.example.demo.security.UserPrincipal;
import com.example.demo.util.AppConstants;
import com.example.demo.util.ModelMapper;
import io.swagger.models.Model;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.*;

import static com.example.demo.util.ModelMapper.mapReviewToReviewResponse;
import static com.example.demo.util.ModelMapper.mapUserToUserResponse;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    public ResponseEntity<?> createReview(UserPrincipal currentUser, String username, ReviewRequest reviewRequest) {
        if (currentUser.getUsername().equals(username)) {
            return new ResponseEntity<>(new ApiResponse(false, "Нельзя оставить отзыв на самого себя"), HttpStatus.BAD_REQUEST);
        }
        User creator = userRepository.findByUsername(currentUser.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", currentUser.getUsername()));
        User reviewed = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        Optional<Review> tmpReview = reviewRepository.findReviewFromTo(creator, reviewed);
        if (tmpReview.isPresent()) {
            Review oldReview = tmpReview.get();
            oldReview.setReview(reviewRequest.getReview());
            oldReview.setScore(reviewRequest.getScore());
            Review result = reviewRepository.save(oldReview);
            URI location = ServletUriComponentsBuilder
                    .fromCurrentContextPath().path("/api/reviews/{review_id}")
                    .buildAndExpand(result.getId()).toUri();
            return ResponseEntity.created(location).body(new ApiResponse(true, "Отзыв успешно обновлен"));
        }
        Review review = new Review();
        review.setReview(reviewRequest.getReview());
        review.setScore(reviewRequest.getScore());
        review.setCreator(creator);
        review.setReviewed(reviewed);


        Review result = reviewRepository.save(review);
        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath().path("/api/reviews/{review_id}")
                .buildAndExpand(result.getId()).toUri();

        return ResponseEntity.created(location).body(new ApiResponse(true, "Отзыв успешно создан"));
    }

    public ResponseEntity<?> updateReview(UserPrincipal currentUser, String username, ReviewRequest reviewRequest) {
        if (currentUser.getUsername().equals(username)) {
            return new ResponseEntity<>(new ApiResponse(false, "Нельзя оставить отзыв на самого себя"), HttpStatus.BAD_REQUEST);
        }
        User creator = userRepository.findByUsername(currentUser.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", currentUser.getUsername()));
        User reviewed = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        Review review = reviewRepository.findReviewFromTo(creator, reviewed)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "review", "from:=" + currentUser.getUsername() + ", to:=" + username));
        review.setReview(reviewRequest.getReview());
        review.setScore(reviewRequest.getScore());
        Review result = reviewRepository.save(review);
        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath().path("/api/reviews/{review_id}")
                .buildAndExpand(result.getId()).toUri();

        return ResponseEntity.created(location).body(new ApiResponse(true, "Отзыв успешно создан"));
    }

    public FullReviewResponse getAllReviews(String username) {
        User reviewed = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        List<Review> reviews = reviewRepository.findAllReviewsForUser(reviewed);
        List<ReviewResponse> reviewResponses = new ArrayList<>();
        float avgScore = 0;
        for (Review review : reviews) {
            reviewResponses.add(mapReviewToReviewResponse(review));
            avgScore += review.getScore();
        }
        FullReviewResponse fullReviewResponse = new FullReviewResponse();
        fullReviewResponse.setReviewed(mapUserToUserResponse(reviewed));
        fullReviewResponse.setReviews(reviewResponses);
        fullReviewResponse.setAvgScore(avgScore / reviews.size());
        return fullReviewResponse;
    }

    public ReviewResponse getMyReview(UserPrincipal currentUser, String username) {
        User creator = userRepository.findByUsername(currentUser.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", currentUser.getUsername()));
        User reviewed = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        Review review = reviewRepository.findReviewFromTo(creator, reviewed)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "review", "from:=" + currentUser.getUsername() + ", to:=" + username));
        return ModelMapper.mapReviewToReviewResponse(review);
    }
}
