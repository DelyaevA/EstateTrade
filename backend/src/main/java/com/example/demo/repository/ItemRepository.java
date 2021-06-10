package com.example.demo.repository;

import com.example.demo.model.Item;
import com.example.demo.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ItemRepository extends JpaRepository<Item, String> {

    @Query(value = "SELECT i.* from items i where i.is_approved = TRUE and current_date <= i.expiration_date_time", nativeQuery = true)
    Page<Item> findAllItems(Pageable pageable);

    @Query(value = "SELECT i from Item i order by i.isApproved")
    Page<Item> findNeedModeratingItemsInAdmin(Pageable pageable);

    Page<Item> findAll(Pageable pageable);

    Page<Item> findByCreatedBy(String userId, Pageable pageable);

    @Query(value = "SELECT i.* from items i where i.created_by = ?1 and current_date <= i.expiration_date_time and i.is_approved = TRUE", nativeQuery = true)
    Page<Item> findUserByCreatedBy(String userId, Pageable pageable);

    @Query(value = "SELECT i from Item i where i.name LIKE %?1% and i.category LIKE ?2% and ?3 <= i.price and i.price <= ?4 and i.isApproved = true")
    Page<Item> findSearchingItems(@Param("name") String name, @Param("category") String category, @Param("minPrice") Long minPrice, @Param("maxPrice") Long maxPrice, Pageable pageable);

    @Query(value = "SELECT i from Item i WHERE i.reports is not empty")
    Page<Item> findAllItemsWithReports(Pageable pageable);
}
