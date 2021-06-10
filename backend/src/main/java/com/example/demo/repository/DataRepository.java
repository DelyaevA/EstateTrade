package com.example.demo.repository;

import com.example.demo.model.User;
import com.example.demo.payload.Statistica;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface DataRepository extends CrudRepository<User, Long> {
    @Query(value="select new com.example.demo.payload.Statistica(u.registrationDate, count(u)) from User u group by u.registrationDate order by u.registrationDate")
    List<Statistica> getUserDataRegistration();
}
