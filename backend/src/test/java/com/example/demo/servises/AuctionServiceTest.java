package com.example.demo.servises;

import com.example.demo.builders.AuctionGenerator;
import com.example.demo.model.Auction;
import com.example.demo.payload.AuctionResponse;
import com.example.demo.service.AuctionService;
import com.example.demo.util.ModelMapper;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ActiveProfiles;

import javax.transaction.Transactional;

@SpringBootTest
@ActiveProfiles("dev")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class AuctionServiceTest {

    @Autowired
    private AuctionService auctionService;

    private static Auction auction;

    private static String auctionId;

    private static AuctionResponse auctionResponse;

    @BeforeAll
    static void initAuction(){
        auction = AuctionGenerator.generateAuction();
        //auctionResponse = AuctionResponseGenerator.generateAuctionResponse();
    }

    @Test
    @Order(0)
    @Transactional
    @Rollback(false)
    void createAuction(){
        //auctionService.createAuction(auctionResponse, auctionResponse.getCreatedBy());
    }

}
