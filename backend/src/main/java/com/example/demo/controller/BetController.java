package com.example.demo.controller;

import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Auction;
import com.example.demo.model.Bet;
import com.example.demo.model.Item;
import com.example.demo.payload.*;
import com.example.demo.repository.AuctionRepository;
import com.example.demo.repository.BetRepository;
import com.example.demo.security.CurrentUser;
import com.example.demo.security.UserPrincipal;
import com.example.demo.service.BetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@RestController
@RequestMapping("/api")
public class BetController {

    @Autowired
    private BetRepository betRepository;

    @Autowired
    private AuctionRepository auctionRepository;

    @Autowired
    private BetService betService;

    @PostMapping("/bets/{auctionId}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> castBet(@CurrentUser UserPrincipal currentUser,
                                   @PathVariable String auctionId,
                                   @Valid @RequestBody BetRequest betRequest) {
        return betService.castBetAndGetUpdatedAuction(auctionId, betRequest, currentUser);
    }

    @GetMapping("/bets/{auctionId}")
    public List<BetResponse> getBetsForAuction(@PathVariable String auctionId) {
        return betService.getBetsForAuction(auctionId);
    }

    @DeleteMapping("/admin/bets/{betId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> deleteBet(@PathVariable String betId) {
        Bet bet = betRepository.findById(betId)
                .orElseThrow(() -> new ResourceNotFoundException("Bet", "bet_id", betId));
        //betRepository.delete(bet);
        betRepository.deleteByBetId(bet.getId());
        Auction auction = auctionRepository.findById(bet.getAuction().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Auction", "auction_id", bet.getAuction().getId()));
        auction.setFreeze(false);
        auction.setExpirationDateTime(auction.getExpirationDateTime().plus(Duration.ofMinutes(ChronoUnit.MINUTES.between(auction.getFreezeDataTime(), Instant.now()))));
        auction.setFreezeDataTime(null);
        auctionRepository.save(auction);
        return new ResponseEntity<>(new ApiResponse(true, "Ставка успешно удалена"), HttpStatus.OK);
    }
}
