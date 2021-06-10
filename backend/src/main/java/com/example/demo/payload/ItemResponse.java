package com.example.demo.payload;


import com.example.demo.model.Address;
import com.example.demo.model.Report;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ItemResponse {
    private String id;
    private String name;
    private String category;
    private String itemType;
    private String condition;
    private Long amount;
    private String description;
    private Address address;
    private Long price;
    private UserSummary createdBy;
    private Instant creationDateTime;
    private Instant expirationDateTime;
    private Boolean isExpired;
    private List<String> picturesLinks;
    private Boolean isModerated;
    private List<Report> reports;
}
