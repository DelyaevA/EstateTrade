package com.example.demo.repository;

import com.example.demo.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ContactRepository extends JpaRepository<Contact, String> {
    @Query("select c from Contact c where (c.firstUser=?1 and c.secondUser=?2) or (c.firstUser=?2 and c.secondUser=?1)")
    Optional<Contact> findByFirstUserAndSecondUser(String firstUser, String secondUser);
}
