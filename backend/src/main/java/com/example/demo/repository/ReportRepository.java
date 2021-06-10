package com.example.demo.repository;

import com.example.demo.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReportRepository extends JpaRepository<Report, String> {

    @Query(value = "SELECT r FROM Report r WHERE r.itemId LIKE %?1%")
    List<Report> getAllByItemId(@Param("itemId") String itemId);

    @Query(value = "SELECT r FROM Report r WHERE r.itemId LIKE %?1%")
    List<Report> getAllByUserId(@Param("userId") String userId);
}
