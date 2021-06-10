package com.example.demo.controller;

import com.example.demo.payload.DashboardResponse;
import com.example.demo.payload.Statistica;
import com.example.demo.repository.DataRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/data")
public class DataController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DataRepository dataRepository;

    @GetMapping("/userDataRegistration")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public DashboardResponse getUserDataRegistration() {
        DashboardResponse dashboardResponse = new DashboardResponse();
        List<Statistica> statisticaList = dataRepository.getUserDataRegistration();
        for (Statistica statistica : statisticaList) {
            dashboardResponse.getX().add((Date) statistica.getX());
            dashboardResponse.getY().add((Long) statistica.getY());
        }
        return dashboardResponse;
    }

}
