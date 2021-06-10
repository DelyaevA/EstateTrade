package com.example.demo.util;

import com.example.demo.model.*;
import com.example.demo.payload.*;
import com.example.demo.service.FilesStorageServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.File;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class ModelMapper {

    @Autowired
    private static FilesStorageServiceImpl storageService;

    public static UserResponse mapUserToUserResponse(User user) {
        UserResponse userResponse = new UserResponse();
        userResponse.setReports(user.getReports());
        userResponse.setUserId(user.getId());
        userResponse.setUsername(user.getUsername());
        userResponse.setEmail(user.getEmail());
        userResponse.setAvatar(user.getLogo());
        return userResponse;
    }

    public static AuctionResponseMinInfo mapAuctionToAuctionResponseMinInfo(Auction auction) {
        AuctionResponseMinInfo auctionResponseMinInfo = new AuctionResponseMinInfo();
        auctionResponseMinInfo.setId(auction.getId());
        auctionResponseMinInfo.setName(auction.getName());
        auctionResponseMinInfo.setCategory(auction.getCategory());
        auctionResponseMinInfo.setCondition(auction.getCondition());
        auctionResponseMinInfo.setModerated(auction.isModerated());
        auctionResponseMinInfo.setApproved(auction.isApproved());
        auctionResponseMinInfo.setFreeze(auction.isFreeze());
        return auctionResponseMinInfo;
    }

    public static ItemResponse mapItemToItemResponse(Item item, UserSummary creatorSummary) {
        ItemResponse itemResponse = new ItemResponse();
        itemResponse.setReports(item.getReports());
        itemResponse.setId(item.getId());
        itemResponse.setName(item.getName());
        itemResponse.setCategory(item.getCategory());
        itemResponse.setItemType(item.getItemType());
        itemResponse.setDescription(item.getDescription());
        itemResponse.setAmount(item.getAmount());
        itemResponse.setPrice(item.getPrice());
        itemResponse.setAddress(item.getAddress());
        itemResponse.setCondition(item.getCondition());
        itemResponse.setCreationDateTime(item.getCreatedAt());
        itemResponse.setExpirationDateTime(item.getExpirationDateTime());
        itemResponse.setIsModerated(item.isModerated());
        Instant now = Instant.now();
        itemResponse.setIsExpired(item.getExpirationDateTime().isBefore(now));
        File dir = new File(System.getenv("ITEMS_ROOT") + "/item_" + item.getId());
        File[] arrFiles = dir.listFiles();
        ArrayList<String> stringPaths = new ArrayList<>();
        if (arrFiles != null) {
            for (File file : arrFiles) {
                stringPaths.add(file.getName());
            }
        }
        itemResponse.setPicturesLinks(stringPaths);
        itemResponse.setCreatedBy(creatorSummary);
        return itemResponse;
    }

    public static AuctionResponse mapAuctionToAuctionResponse(Auction auction, UserSummary creatorSummary) {
        AuctionResponse actionResponse = new AuctionResponse();
        actionResponse.setId(auction.getId());
        actionResponse.setName(auction.getName());
        actionResponse.setCondition(auction.getCondition());
        actionResponse.setCategory(auction.getCategory());
        actionResponse.setDescription(auction.getDescription());
        actionResponse.setCreationDateTime(auction.getCreatedAt());
        actionResponse.setExpirationDateTime(auction.getExpirationDateTime());
        actionResponse.setEndPrice(auction.getEndPrice());
        actionResponse.setFreeze(auction.isFreeze());
        actionResponse.setIsModerated(auction.isModerated());
        Instant now = Instant.now();
        actionResponse.setIsExpired(auction.getExpirationDateTime().isBefore(now));
        actionResponse.setCreatedBy(creatorSummary);
        actionResponse.setAddress(auction.getAddress());
        actionResponse.setDaysAction(auction.getDaysAction());
        actionResponse.setAuctionTime(auction.getAuctionTime());
        actionResponse.setMinPrice(auction.getMinPrice());
        List<BetResponse> betResponses = new ArrayList<>();
        for (Bet bet: auction.getBets()){
            betResponses.add(ModelMapper.mapBetToBerResponse(bet));
        }
        actionResponse.setBets(betResponses);
        File dir = new File(System.getenv("AUCTIONS_ROOT") + "/auction_" + auction.getId());
        File[] arrFiles = dir.listFiles();
        ArrayList<String> stringPaths = new ArrayList<>();
        if (arrFiles != null) {
            for (File file : arrFiles) {
                stringPaths.add(file.getName());
            }
        }
        actionResponse.setPicturesLinks(stringPaths);
        return actionResponse;
    }

    public static AuctionFullResponse mapAuctionToAuctionFullResponse(Auction auction, UserSummary creatorSummary, List<BetResponse> betResponses) {
        AuctionFullResponse auctionFullResponse = new AuctionFullResponse();
        auctionFullResponse.setId(auction.getId());
        auctionFullResponse.setName(auction.getName());
        auctionFullResponse.setCategory(auction.getCategory());
        auctionFullResponse.setDescription(auction.getDescription());
        auctionFullResponse.setCondition(auction.getCondition());
        auctionFullResponse.setMinPrice(auction.getMinPrice());
        auctionFullResponse.setMaxPrice(auction.getMaxPrice());
        auctionFullResponse.setEndPrice(auction.getEndPrice());
        auctionFullResponse.setPictures(auction.getPictures());
        auctionFullResponse.setBets(betResponses);
        auctionFullResponse.setModerated(auction.isModerated());
        auctionFullResponse.setApproved(auction.isApproved());
        auctionFullResponse.setFreeze(auction.isFreeze());
        auctionFullResponse.setCreationDateTime(auction.getCreatedAt());
        Instant now = Instant.now();
        auctionFullResponse.setIsExpired(auction.getExpirationDateTime().isBefore(now));
        auctionFullResponse.setCreatedBy(creatorSummary);
        auctionFullResponse.setFreezeDataTime(auction.getFreezeDataTime());
        auctionFullResponse.setExpirationDateTime(auction.getExpirationDateTime());
        auctionFullResponse.setDaysAuction(auction.getDaysAction());
        auctionFullResponse.setAuctionTime(auction.getAuctionTime());
        return auctionFullResponse;
    }

    public static BetResponse mapBetToBerResponse(Bet bet) {
        BetResponse betResponse = new BetResponse();
        betResponse.setId(bet.getId());
        User user = bet.getUser();
        UserSummary userSummary = new UserSummary(user.getId(), user.getUsername(), 0, user.getLogo());
        betResponse.setCreatedBy(userSummary);
        betResponse.setPrice(bet.getPrice());
        betResponse.setCreationDateTime(bet.getCreatedAt());
        return betResponse;
    }

    public static ReviewResponse mapReviewToReviewResponse(Review review) {
        ReviewResponse reviewResponse = new ReviewResponse();
        reviewResponse.setReview(review.getReview());
        reviewResponse.setScore(review.getScore());
        reviewResponse.setCreator(mapUserToUserResponse(review.getCreator()));
        return reviewResponse;
    }

    public static UserSummary mapUserToUserSummaryForChat(User user) {
        return new UserSummary(user.getId(), user.getUsername(), user.getLogo());
    }
}
