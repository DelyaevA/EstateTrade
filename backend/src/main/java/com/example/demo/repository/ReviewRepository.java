package com.example.demo.repository;

import com.example.demo.model.Item;
import com.example.demo.model.Review;
import com.example.demo.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    @Query("select r from Review r where r.reviewed=:user order by r.createdAt desc")
    List<Review> findAllReviewsForUser(@Param("user") User user);

    @Query("select r from Review r where r.creator=:user1 and r.reviewed=:user2")
    Optional<Review> findReviewFromTo(@Param("user1") User user1, @Param("user2") User user2);
}
