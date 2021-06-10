package com.example.demo.repository;

import com.example.demo.model.Auction;
import com.example.demo.model.Item;
import com.example.demo.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AuctionRepository extends CrudRepository<Auction, String> {
    @Query(value = "SELECT a.* from auctions a where a.is_approved = TRUE and current_date <= a.expiration_date_time and a.is_freeze = false", nativeQuery = true)
    Page<Auction> findAllAuctions(Pageable pageable);

    @Query(value = "select * from auctions a where a.is_freeze = false " +
                   "and a.expiration_date_time < :d", nativeQuery = true)
    List<Auction> findAllAuctionNotFreeze(@Param("d")LocalDateTime dateTime);

    @Query(value = "SELECT a from Auction a order by a.isApproved, a.isFreeze")
    Page<Auction> findNeedModeratingAuctionsInAdmin(Pageable pageable);

    @Query(value = "SELECT a from Auction a where a.name LIKE %?1% and a.category LIKE ?2% and ?3 <= a.minPrice and a.endPrice <= ?4 and a.isApproved = true and a.isFreeze = false ")
    Page<Auction> findSearchingAuctions(@Param("name") String name, @Param("category") String category, @Param("minPrice") Long minPrice, @Param("maxPrice") Long maxPrice, Pageable pageable);

    @Query(value = "SELECT a.* from auctions a where a.created_by = ?1 and current_date <= a.expiration_date_time and a.is_approved = TRUE", nativeQuery = true)
    Page<Auction> findUserByCreatedBy(String userId, Pageable pageable);

    Page<Auction> findByCreatedBy(String id, Pageable pageable);
}
