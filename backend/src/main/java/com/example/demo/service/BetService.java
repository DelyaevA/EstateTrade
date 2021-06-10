package com.example.demo.service;

import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Auction;
import com.example.demo.model.Bet;
import com.example.demo.model.Item;
import com.example.demo.model.User;
import com.example.demo.payload.*;
import com.example.demo.repository.AuctionRepository;
import com.example.demo.repository.BetRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.UserPrincipal;
import com.example.demo.util.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.text.DateFormat;
import java.text.DateFormatSymbols;
import java.text.SimpleDateFormat;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

@Service
public class BetService {
    @Autowired
    private BetRepository betRepository;

    @Autowired
    private AuctionRepository auctionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MailSender mailSender;

    public List<Bet> getAllBets() {
        return betRepository.findAll();
    }

    public ResponseEntity<?> castBetAndGetUpdatedAuction(String auctionId, BetRequest betRequest, UserPrincipal currentUser) {
        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new ResourceNotFoundException("Auction", "id", auctionId));

        if(auction.getExpirationDateTime().isBefore(Instant.now())) {
            return ResponseEntity.status( HttpStatus.BAD_REQUEST).body(new ResponseMessage("Аукцион уже завершен!"));
        }

        User user = userRepository.getOne(currentUser.getId());

        Bet bet = new Bet();
        bet.setPrice(betRequest.getPrice());
        bet.setAuction(auction);
        bet.setUser(user);

        List<Bet> bets = betRepository.findAllForAuction(auction);
        long lastBetValue;

        if (!bets.isEmpty()) {
            lastBetValue = bets.get(0).getPrice();
        } else {
            lastBetValue = auction.getMinPrice();
        }
        if (!bets.isEmpty() && bet.getUser().getId().equals(bets.get(0).getUser().getId())){
            return ResponseEntity.status( HttpStatus.BAD_REQUEST).body(new ResponseMessage("Вы уже сделали ставку!"));
        }
        if (lastBetValue > betRequest.getPrice() || lastBetValue == betRequest.getPrice() || betRequest.getPrice() == null)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseMessage("Слишком маленькая ставка!"));
        bet = betRepository.save(bet);

        if (bets.size() >= 1) {
            Bet lastBet = bets.get(0);
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy hh:mm:ss").withZone(ZoneId.from(ZoneOffset.UTC));
            String output = formatter.format( auction.getExpirationDateTime() );
            String message = String.format("Ваша ставка была перебита!\nИмя аукциона: %s,\nСсылка на аукцион: %s," +
                            "\nТекущая ставка: %d руб,\nДата завершения аукциона: %s",
                    auction.getName(), System.getenv("FRONTEND") + "/auctions/"+ auction.getId(), bet.getPrice(), output);

            mailSender.send(lastBet.getUser().getEmail(), "Аукцион, " + auction.getName(), message);
        }


        bets = betRepository.findAllForAuction(auction);
        if (!isGoodBet(bet.getPrice(), lastBetValue)) {
            // Замораживаем аукцион, если ставка подозрительная
            auction.setFreeze(true);
            auction.setFreezeDataTime(Instant.now());
            auctionRepository.save(auction);
        }

        List<BetResponse> betResponses = new ArrayList<>();
        for (Bet b: bets) {
            betResponses.add(ModelMapper.mapBetToBerResponse(b));
        }

        return new ResponseEntity<>(betResponses, HttpStatus.OK);
    }

    // Проверяем ставку, чтобы предотвратить саботаж аукциона
    private boolean isGoodBet(long bet, long lastBet) {
        double k = 100;
        if (bet >= ((double) lastBet) * k) {
            return false;
        } else {
            return true;
        }
    }


    public List<BetResponse> getBetsForAuction(String auctionId) {
        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new ResourceNotFoundException("Auction", "auctionId", auctionId));
        List<Bet> bets = betRepository.findAllForAuction(auction);
        List<BetResponse> betResponses = new ArrayList<>();
        for (Bet bet: bets) {
            betResponses.add(ModelMapper.mapBetToBerResponse(bet));
        }
        return betResponses;
    }
}
