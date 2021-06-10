package com.example.demo.service;

import com.example.demo.exception.AppException;
import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.*;
import com.example.demo.payload.*;
import com.example.demo.repository.AuctionRepository;
import com.example.demo.repository.BetRepository;
import com.example.demo.repository.ReviewRepository;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.UserPrincipal;
import com.example.demo.util.AppConstants;
import com.example.demo.util.ModelMapper;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AuctionService {

    private RoleRepository roleRepository;

    private ReviewRepository reviewRepository;

    private AuctionRepository auctionRepository;

    private UserRepository userRepository;

    private BetRepository betRepository;

    private MailSender mailSender;

    @Autowired
    public AuctionService(RoleRepository roleRepository, ReviewRepository reviewRepository,
                          AuctionRepository auctionRepository, UserRepository userRepository,
                          BetRepository betRepository, MailSender mailSender) {
        this.roleRepository = roleRepository;
        this.reviewRepository = reviewRepository;
        this.auctionRepository = auctionRepository;
        this.userRepository = userRepository;
        this.betRepository = betRepository;
        this.mailSender = mailSender;
    }

    private static final String CRON = "0 0/5 * * * *";

    private final RestTemplate restTemplate = new RestTemplate();

    private final static String url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/";


    public AuctionResponse getAuctionById(String auctionId, UserPrincipal currentUser) {
        Auction auction = auctionRepository.findById(auctionId).orElseThrow(
                () -> new ResourceNotFoundException("Auction", "id", auctionId));

        // Retrieve item creator details
        User creator = userRepository.findById(auction.getCreatedBy())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", auction.getCreatedBy()));


        List<Review> reviews = reviewRepository.findAllReviewsForUser(creator);
        double avgScore = 0.0;
        for (Review review : reviews) {
            avgScore += review.getScore();
        }

        double score = reviews.size() == 0 ? 0 : avgScore/reviews.size();

        UserSummary creatorSummary = new UserSummary(creator.getId(), creator.getUsername(), isAdmin(creator), creator.getLogo(), score, creator.getRegistrationDate());

        return ModelMapper.mapAuctionToAuctionResponse(auction,
                creatorSummary);
    }

    private long isAdmin(User user) {
        Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN)
                .orElseThrow(() -> new AppException("User Role not found."));

        Set<Role> userRoles = user.getRoles();

        long isAdmin = 0;
        if (userRoles.contains(adminRole)) {
            isAdmin = 1;
        }

        return isAdmin;
    }

    public Auction createAuction(AuctionRequest auctionRequest) {
        Auction auction = new Auction();
        Address address = new Address();
        address.setAddressName(auctionRequest.getAddress());
        auction.setName(auctionRequest.getName());
        auction.setCategory(auctionRequest.getCategory());
        auction.setDescription(auctionRequest.getDescription());
        auction.setMinPrice(auctionRequest.getMinPrice());
        auction.setMaxPrice(auctionRequest.getMaxPrice());
        auction.setModerated(false);
        auction.setApproved(false);
        auction.setComment("");
        auction.setFreeze(false);
        auction.setEndPrice(auctionRequest.getEndPrice());
        auction.setCondition(auctionRequest.getCondition());
        Instant now = Instant.now();
        if (auctionRequest.getDuration() == 15){
            auction.setExpirationDateTime(now.plus(Duration.ofMinutes(10)));
        }else {
            Instant expirationDateTime = now.plus(Duration.ofDays(auctionRequest.getDuration()));
            auction.setExpirationDateTime(expirationDateTime);
        }
        Calendar cal = Calendar.getInstance();
        Date date = cal.getTime();
        auction.setAddress(address);
        getAddress(auction, auctionRequest.getAddress());
        auction.setAuctionTime(String.valueOf(date));
        return auctionRepository.save(auction);
    }

    protected String getUrlParameters(String address) {
        return "{ \"query\": \"" + address.trim() +
                "\", \"count\": " + 1 +
                " }";
    }

    public byte[] getPostData(String address) {
        return  this.getUrlParameters(address).getBytes(StandardCharsets.UTF_8);
    }

    public void getAddress(Auction auction, String address) {
        String coordinates = "";
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.add("Authorization", "Token da5f9d476188ea40e5dda840f79bc18277526db7");

        var rootNode = restTemplate.
                postForObject(url + "address", new HttpEntity<>(getPostData(address), headers), JsonNode.class);

        assert rootNode != null;

        if (rootNode != null) {
            for (JsonNode node : rootNode.path("suggestions")) {

                JsonNode data = node.path("data");

                if (data.hasNonNull("geo_lat"))
                    auction.getAddress().setGeoLat(Double.parseDouble(data.path("geo_lat").asText()));

                if (data.hasNonNull("geo_lon"))
                    auction.getAddress().setGeoLon(Double.parseDouble(data.path("geo_lon").asText()));
            }
        }
    }

    public ResponseEntity<?> moderate(String auctionId, ModerateRequest moderateRequest) {
        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new ResourceNotFoundException("Auction", "auction_id", auctionId));

        auction.setModerated(true);
        auction.setApproved(moderateRequest.isApproved());
        auction.setComment(moderateRequest.getComment());
        auctionRepository.save(auction);

        return new ResponseEntity<>(new ApiResponse(true, "Auction has been successfully updated"), HttpStatus.OK);
    }

    public PagedResponse<AuctionResponse> getAllAuctions(UserPrincipal currentUser, int page, int size) {
        validatePageNumberAndSize(page, size);

        // Retrieve Users
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "created_at");
        Page<Auction> auctions = auctionRepository.findAllAuctions(pageable);

        if(auctions.getNumberOfElements() == 0) {
            return new PagedResponse<>(Collections.emptyList(), auctions.getNumber(),
                    auctions.getSize(), auctions.getTotalElements(), auctions.getTotalPages(), auctions.isLast());
        }


        Map<String, UserSummary> creatorMap = getAuctionCreatorMap(auctions.getContent());

        List<AuctionResponse> auctionResponses = auctions.map(auction -> {
            return ModelMapper.mapAuctionToAuctionResponse(auction,
                    creatorMap.get(auction.getCreatedBy()));
        }).getContent();

        return new PagedResponse<>(auctionResponses, auctions.getNumber(),
                auctions.getSize(), auctions.getTotalElements(), auctions.getTotalPages(), auctions.isLast());
    }

    Map<String, UserSummary> getAuctionCreatorMap(List<Auction> auctions) {
        // Get Auction Creator details of the given list of auctions
        List<String> creatorIds = auctions.stream()
                .map(Auction::getCreatedBy)
                .distinct()
                .collect(Collectors.toList());

        List<User> creators = userRepository.findByIdIn(creatorIds);

        return creators.stream().collect(Collectors.toMap(User::getId, u -> new UserSummary(u.getId(), u.getUsername(), 0, u.getLogo())));
    }

    public AuctionResponse freezeAuctionNow(String auctionId, UserPrincipal currentUser){
        Auction auction = auctionRepository.findById(auctionId).orElseThrow(
                () -> new ResourceNotFoundException("Auction", "id", auctionId));
        User creator = userRepository.findById(auction.getCreatedBy())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", auction.getCreatedBy()));
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUser.getId()));
        Bet bet = new Bet();
        bet.setPrice(auction.getEndPrice());
        bet.setAuction(auction);
        bet.setUser(user);
        betRepository.save(bet);
        auction.setFreeze(true);
        auction.setExpirationDateTime(Instant.now());
        String message = String.format(
                "Здравствуйте, " + creator.getUsername() + ".\n" +
                        "Поздравляем! У вас купили " + auction.getName() + " за " + auction.getEndPrice() + " руб"
                + "\nСсылка на аукцион: " + System.getenv("FRONTEND") + "/auctions/"+ auction.getId()
                + "\nСсылка на победителя: " + System.getenv("FRONTEND") + "/profile/"+ user.getUsername()
        );
        mailSender.send(creator.getEmail(), "Аукцион", message);
        message = String.format(
                "Здравствуйте, " + user.getUsername() + ".\n" +
                        "Поздравляем! Вы купили " + auction.getName() + " за " + auction.getEndPrice() + " руб"
                        + "\nСсылка на аукцион: " + System.getenv("FRONTEND") + "/auctions/"+ auction.getId()
                        + "\nСсылка на продавца: " + System.getenv("FRONTEND") + "/profile/"+ creator.getUsername()
        );
        mailSender.send(user.getEmail(), "Аукцион", message);
        List<Review> reviews = reviewRepository.findAllReviewsForUser(creator);
        double avgScore = 0.0;
        for (Review review : reviews) {
            avgScore += review.getScore();
        }

        double score = reviews.size() == 0 ? 0 : avgScore/reviews.size();

        auctionRepository.save(auction);
        UserSummary creatorSummary = new UserSummary(creator.getId(), creator.getUsername(), isAdmin(creator), creator.getLogo(), score, creator.getRegistrationDate());

        return ModelMapper.mapAuctionToAuctionResponse(auction,
                creatorSummary);
    }

    @Scheduled(cron = CRON)
    public void endAuction(){
        LocalDateTime localDate = LocalDateTime.now();
        List<Auction> auctions = auctionRepository.findAllAuctionNotFreeze(localDate);
        if (!auctions.isEmpty()){
            for (Auction auction : auctions){
                freezeAuction(auction.getId());
            }
        }
    }

    public AuctionResponse freezeAuction(String auctionId){
        Auction auction = auctionRepository.findById(auctionId).orElseThrow(
                () -> new ResourceNotFoundException("Auction", "id", auctionId));
        List<Bet> bets = betRepository.findAllForAuction(auction);
        User creator = userRepository.findById(auction.getCreatedBy())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", auction.getCreatedBy()));
        if(!bets.isEmpty()) {
            User user = userRepository.findById(bets.get(0).getUser().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", bets.get(0).getUser().getId()));
            auction.setFreeze(true);
            String message = String.format(
                    "Здравствуйте, " + creator.getUsername() + ".\n" +
                            "Поздравляем! У вас купили " + auction.getName() + " (" + System.getenv("FRONTEND") + "/auctions/"+ auction.getId() +") за " + auction.getBets().get(auction.getBets().size()-1).getPrice()
            );
            mailSender.send(creator.getEmail(), "Аукцион", message);
            message = String.format(
                    "Здравствуйте, " + user.getUsername() + ".\n" +
                            "Поздравляем! Вы купили " + auction.getName() + " (" + System.getenv("FRONTEND") + "/auctions/"+ auction.getId() +") за " + auction.getBets().get(auction.getBets().size()-1)
            );
            mailSender.send(user.getEmail(), "Аукцион", message);
        }
        else {
            String message = String.format(
                    "Здравствуйте, " + creator.getUsername() + ".\n" +
                            "Аукцион " + auction.getName() + " (" + System.getenv("FRONTEND") + "/auctions/"+ auction.getId() + ") никто не выйграл"
            );
            mailSender.send(creator.getEmail(), "Аукцион", message);
        }
        auction.setFreeze(true);
        auction.setExpirationDateTime(Instant.now());
        List<Review> reviews = reviewRepository.findAllReviewsForUser(creator);
        double avgScore = 0.0;
        for (Review review : reviews) {
            avgScore += review.getScore();
        }

        double score = reviews.size() == 0 ? 0 : avgScore/reviews.size();

        auctionRepository.save(auction);
        UserSummary creatorSummary = new UserSummary(creator.getId(), creator.getUsername(), isAdmin(creator), creator.getLogo(), score, creator.getRegistrationDate());

        return ModelMapper.mapAuctionToAuctionResponse(auction,
                creatorSummary);
    }

    public PagedResponse<AuctionResponse> getSearchingItems(UserPrincipal currentUser, int page, int size, SearchRequest searchRequest) {
        validatePageNumberAndSize(page, size);

        //Retrieve Offers
        Pageable pageable = PageRequest.of(page, size);
        if (searchRequest.getMinPrice() == null) {
            searchRequest.setMinPrice(0L);
        }
        if (searchRequest.getMaxPrice() == null) {
            searchRequest.setMaxPrice(Long.MAX_VALUE);
        }
        Page<Auction> offers = auctionRepository.findSearchingAuctions(searchRequest.getQuery(), searchRequest.getCategory(), searchRequest.getMinPrice(), searchRequest.getMaxPrice(), pageable);

        if (offers.getNumberOfElements() == 0) {
            return new PagedResponse<>(Collections.emptyList(), offers.getNumber(),
                    offers.getSize(), offers.getTotalElements(), offers.getTotalPages(), offers.isLast());
        }


        // Map Items to ItemResponses containing item creator details
        Map<String, UserSummary> creatorMap = getAuctionCreatorMap(offers.getContent());

        List<AuctionResponse> auctionResponses = offers.map(offer -> {
            return ModelMapper.mapAuctionToAuctionResponse(offer,
                    creatorMap.get(offer.getCreatedBy()));
        }).getContent();

        return new PagedResponse<AuctionResponse>(auctionResponses, offers.getNumber(),
                offers.getSize(), offers.getTotalElements(), offers.getTotalPages(), offers.isLast());
    }

    private void validatePageNumberAndSize(int page, int size) {
        if (page < 0) {
            throw new BadRequestException("Page number cannot be less than zero.");
        }

        if (size > AppConstants.MAX_PAGE_SIZE) {
            throw new BadRequestException("Page size must not be greater than " + AppConstants.MAX_PAGE_SIZE);
        }
    }

    public PagedResponse<AuctionResponse> getAuctionsCreatedBy(String username, UserPrincipal currentUser, int page, int size) {
        validatePageNumberAndSize(page, size);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        if (!currentUser.getId().equals(user.getId())) {
            return new PagedResponse<>(Collections.emptyList(), 0,
                    0, 0, 0, false);
        }

        // Retrieve all items created by the given username
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "createdAt");
        Page<Auction> auctions = auctionRepository.findByCreatedBy(user.getId(), pageable);

        if (auctions.getNumberOfElements() == 0) {
            return new PagedResponse<>(Collections.emptyList(), auctions.getNumber(),
                    auctions.getSize(), auctions.getTotalElements(), auctions.getTotalPages(), auctions.isLast());
        }

        // Map Items to itemResponses containing items creator details

        UserSummary creatorSummary = new UserSummary(user.getId(), user.getUsername(), isAdmin(user), user.getLogo());

        List<AuctionResponse> auctionResponses = auctions.map(auction -> {
            return ModelMapper.mapAuctionToAuctionResponse(auction,
                    creatorSummary);
        }).getContent();

        return new PagedResponse<>(auctionResponses, auctions.getNumber(),
                auctions.getSize(), auctions.getTotalElements(), auctions.getTotalPages(), auctions.isLast());
    }

    public PagedResponse<AuctionResponse> getUserAuctionsCreatedBy(String username, UserPrincipal currentUser, int page, int size) {
        validatePageNumberAndSize(page, size);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        // Retrieve all items created by the given username
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "created_at");
        Page<Auction> auctions = auctionRepository.findUserByCreatedBy(user.getId(), pageable);

        if (auctions.getNumberOfElements() == 0) {
            return new PagedResponse<>(Collections.emptyList(), auctions.getNumber(),
                    auctions.getSize(), auctions.getTotalElements(), auctions.getTotalPages(), auctions.isLast());
        }

        // Map Items to itemResponses containing items creator details

        UserSummary creatorSummary = new UserSummary(user.getId(), user.getUsername(), isAdmin(user), user.getLogo());

        List<AuctionResponse> auctionResponses = auctions.map(auction -> {
            return ModelMapper.mapAuctionToAuctionResponse(auction,
                    creatorSummary);
        }).getContent();

        return new PagedResponse<>(auctionResponses, auctions.getNumber(),
                auctions.getSize(), auctions.getTotalElements(), auctions.getTotalPages(), auctions.isLast());
    }

    public PagedResponse<AuctionResponseMinInfo> getAllAuctionsForAdmin(int page, int size) {
        validatePageNumberAndSize(page, size);

        //Retrieve auctions
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "createdAt");
        Page<Auction> auctions = auctionRepository.findNeedModeratingAuctionsInAdmin(pageable);

        if (auctions.getNumberOfElements() == 0) {
            return new PagedResponse<>(Collections.emptyList(), auctions.getNumber(),
                    auctions.getSize(), auctions.getTotalElements(), auctions.getTotalPages(), auctions.isLast());
        }

        List<AuctionResponseMinInfo> auctionResponseMinInfos = auctions.map(ModelMapper::mapAuctionToAuctionResponseMinInfo).getContent();

        return new PagedResponse<>(auctionResponseMinInfos, auctions.getNumber(),
                auctions.getSize(), auctions.getTotalElements(), auctions.getTotalPages(), auctions.isLast());
    }

    public AuctionFullResponse getFullInfo(String auctionId) {
        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new ResourceNotFoundException("Auction", "auction_id", auctionId));

        List<Bet> bets = betRepository.findAllForAuction(auction);
        List<BetResponse> betResponses = new ArrayList<>();
        for (Bet bet : bets) {
            betResponses.add(ModelMapper.mapBetToBerResponse(bet));
        }
        // Retrieve item creator details
        User creator = userRepository.findById(auction.getCreatedBy())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", auction.getCreatedBy()));
        UserSummary creatorSummary = new UserSummary(creator.getId(), creator.getUsername(),  creator.getLogo());
        return ModelMapper.mapAuctionToAuctionFullResponse(auction, creatorSummary, betResponses);
    }
}
