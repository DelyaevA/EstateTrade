package com.example.demo.builders;

import com.example.demo.model.Auction;
import com.example.demo.payload.AuctionRequest;
import com.example.demo.payload.AuctionResponse;
import com.example.demo.util.ModelMapper;

import java.time.Instant;

public class AuctionGenerator {

    public static Auction generateAuction(){
        return Auction.builder()
                .isFreeze(false)
                .category("Мебель")
                .name("Диван")
                .comment("Удобный")
                .address(AddressGenerator.generateAddress())
                .build();
    }

    public static AuctionResponse generateAuctionResponse(){
        return AuctionResponse.builder()
                .address(AddressGenerator.generateAddress())
                .category("Телефоны")
                .createdBy(ModelMapper.mapUserToUserSummaryForChat(UserGenerator.generateUser()))
                .isFreeze(false)
                .endPrice(70000L)
                .minPrice(45000L)
                .isModerated(true)
                .isExpired(true)
                .condition("Новый")
                .daysAction("2")
                .creationDateTime(Instant.now())
                .build();
    }

    public static AuctionRequest generateAuctionRequest(){
        return AuctionRequest.builder()
                .address(AddressGenerator.generateAddress().getAddressName())
                .category("Телефоны")
                //.createdBy(ModelMapper.mapUserToUserSummaryForChat(UserGenerator.generateUser()))
                .isFreeze(false)
                .endPrice(70000L)
                .minPrice(45000L)
                //.m(true)
                //.isExpired(true)
                .condition("Новый")
                .daysAction("2")
                //.creationDateTime(Instant.now())
                .build();
    }
}
