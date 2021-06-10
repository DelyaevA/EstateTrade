package com.example.demo.payload;

import com.example.demo.model.Address;
import lombok.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuctionResponse {
    private String id;
    private String name;
    private String category;
    private String description;
    private String condition;
    private Long minPrice;
    private Long maxPrice;
    private Long endPrice;
    private String daysAction;
    private String pictures;
    private UserSummary createdBy;
    private Instant creationDateTime;
    private Instant expirationDateTime;
    private Boolean isExpired;
    private List<String> picturesLinks;
    private Boolean isModerated;
    private Address address;
    private String auctionTime;
    private boolean isFreeze;
    private List<BetResponse> bets = new ArrayList<>();
}
