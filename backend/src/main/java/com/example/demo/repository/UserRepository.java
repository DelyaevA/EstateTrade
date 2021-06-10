package com.example.demo.repository;

import com.example.demo.model.User;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);

    Optional<User> findByUsernameOrEmail(String username, String email);

    List<User> findByIdIn(List<String> userIds);

    Optional<User> findByUsername(String username);

    @Query(value = "SELECT u FROM User u WHERE u.reports is not empty")
    Page<User> findAllUsersWithReports(Pageable pageable);

    @Query(value = "select distinct u\n" +
            "  from Contact c\n" +
            "       left join User u on\n" +
            "           c.firstUser=u.id or c.secondUser=u.id\n" +
            "  where u.id <> ?1 and\n" +
            "        (c.firstUser = ?1 or c.secondUser=?1)")
    List<User> findAllContact(String id);

    Optional<User> findById(String username);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);

    Boolean existsByPhone(String phone);

    User findByActivationCode(String code);

    User findByResetPassword(String code);
}
