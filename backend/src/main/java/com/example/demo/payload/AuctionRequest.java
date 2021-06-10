package com.example.demo.payload;

import lombok.*;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class AuctionRequest {
    private String name;
    private String category;
    private String description;
    private String condition;
    private Long minPrice;
    private Long maxPrice;
    private Long endPrice;
    private String pictures;
    private Long duration;
    private String auctionTime;
    private String address;
    private Double geoLat;
    private Double geoLon;
    private String daysAction;
    private boolean isFreeze;

    public void setDaysAuction(String daysAction){
        this.daysAction = daysAction;
    }

}
