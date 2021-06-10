package com.example.demo.builders;

import com.example.demo.model.User;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

public class UserGenerator {

    public static User generateUser(){
        return User.builder()
                .username("Fenxo")
                .email("max@gmail.com")
                .password("000000")
                .activationCode(null)
                .isActive(true)
                .registrationDate(Date.from(Instant.now())).build();
    }
}
