package com.example.demo.payload;

import com.example.demo.model.Bet;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AuctionFullResponse {
    private String id;
    private String name;
    private String category;
    private String description;
    private String condition;
    private Long minPrice;
    private Long maxPrice;
    private Long endPrice;
    private String pictures;
    private List<BetResponse> bets = new ArrayList<>();
    private boolean isModerated;
    private boolean isApproved;
    private boolean isFreeze;
    private Instant creationDateTime;
    private Boolean isExpired;
    private UserSummary createdBy;
    private Instant freezeDataTime;
    private String comment;
    private Instant expirationDateTime;
    private String daysAuction;
    private String auctionTime;
}
