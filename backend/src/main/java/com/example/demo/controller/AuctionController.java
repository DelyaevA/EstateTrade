package com.example.demo.controller;

import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Auction;
import com.example.demo.payload.*;
import com.example.demo.repository.AuctionRepository;
import com.example.demo.security.CurrentUser;
import com.example.demo.security.UserPrincipal;
import com.example.demo.service.AuctionService;
import com.example.demo.util.AppConstants;
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

@RestController
@RequestMapping("/api")
public class AuctionController {

    @Autowired
    private AuctionService auctionService;

    @Autowired
    private AuctionRepository auctionRepository;

    @GetMapping("/auctions")
    public PagedResponse<AuctionResponse> getAllAuctions(@CurrentUser UserPrincipal currentUser,
                                                      @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
                                                      @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        return auctionService.getAllAuctions(currentUser, page, size);
    }

    @GetMapping("/auctions/{auctionId}")
    public AuctionResponse getAuctionById(@CurrentUser UserPrincipal currentUser,
                                       @PathVariable(value = "auctionId") String auctionId) {
        return auctionService.getAuctionById(auctionId, currentUser);
    }

    @GetMapping("/admin/auctions")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public PagedResponse<AuctionResponseMinInfo> getAllItemsForAdmin(@RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
                                                                     @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        return auctionService.getAllAuctionsForAdmin(page, size);
    }

    @PostMapping("/auctions/search")
    public PagedResponse<AuctionResponse> getSearchingItems(@CurrentUser UserPrincipal currentUser,
                                                            @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
                                                            @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
                                                            @Valid @RequestBody SearchRequest searchRequest) {
        return auctionService.getSearchingItems(currentUser, page, size, searchRequest);
    }

    @PostMapping("/auctions/end/now/{auctionId}")
    public AuctionResponse endAuctionNow(@CurrentUser UserPrincipal currentUser,
                                      @PathVariable(value = "auctionId") String auctionId) {
        return auctionService.freezeAuctionNow(auctionId, currentUser);
    }

    @PostMapping("/auctions/end/{auctionId}")
    public AuctionResponse endAuction(@PathVariable(value = "auctionId") String auctionId) {
        return auctionService.freezeAuction(auctionId);
    }

    @PostMapping("/auctions")
    @PreAuthorize("hasRole('USER')")
    public AuctionResponse createAuction(@Valid @RequestBody AuctionRequest auctionRequest,
                                         @CurrentUser UserPrincipal currentUser) {
        Auction auction = auctionService.createAuction(auctionRequest);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest().path("/{pollId}")
                .buildAndExpand(auction.getId()).toUri();

        return auctionService.getAuctionById(auction.getId(), currentUser);
    }


    @PutMapping("/admin/auctions/{auctionId}/moderate")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> moderateAuction(@Valid @RequestBody ModerateRequest moderateRequest, @PathVariable String auctionId) {
        return  auctionService.moderate(auctionId, moderateRequest);
    }

    @PutMapping("/admin/auctions/{auctionId}/unfreeze")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> unfreeze(@PathVariable String auctionId) {
        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new ResourceNotFoundException("Auction", "auction_id", auctionId));
        auction.setFreeze(false);
        auction.setExpirationDateTime(auction.getExpirationDateTime().plus(Duration.ofMinutes(ChronoUnit.MINUTES.between(auction.getCreatedAt(),Instant.now()))));
        auction.setFreezeDataTime(null);
        auctionRepository.save(auction);
        return new ResponseEntity<>(new ApiResponse(true, "Аукцион успешно разморожен!"), HttpStatus.OK);
    }

    @GetMapping("/admin/auctions/{auctionId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public AuctionFullResponse getFullInfo(@PathVariable String auctionId) {
        return auctionService.getFullInfo(auctionId);
    }
}
