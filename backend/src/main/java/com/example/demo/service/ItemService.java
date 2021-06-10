package com.example.demo.service;

import com.example.demo.exception.AppException;
import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.*;
import com.example.demo.payload.*;
import com.example.demo.repository.ItemRepository;
import com.example.demo.repository.ReviewRepository;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.UserPrincipal;
import com.example.demo.util.AppConstants;
import com.example.demo.util.ModelMapper;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private RoleRepository roleRepository;

    private final RestTemplate restTemplate = new RestTemplate();

    private final static String url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/";

    public Item updateItem(ItemUpdateRequest itemRequest, String itemId, UserPrincipal userPrincipal){
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item", "item_id", itemId));
        if (!userPrincipal.getId().equals(item.getCreatedBy())){
            return null;
        }else {
            Address address = new Address();
            getAddress(item, itemRequest.getAddress());
            item.setName(itemRequest.getName());
            item.setPrice(itemRequest.getPrice());
            item.setCategory(itemRequest.getCategory());
            item.setItemType(itemRequest.getItemType());
            item.setCondition(itemRequest.getCondition());
            item.setAmount(itemRequest.getAmount());
            item.setDescription(itemRequest.getDescription());
            item.setId(itemId);

            Item result = itemRepository.save(item);
            URI location = ServletUriComponentsBuilder
                    .fromCurrentContextPath().path("/api/users/{username}")
                    .buildAndExpand(result.getId()).toUri();
            return item;
        }
    }

    public Item createItem(ItemRequest itemRequest) {

        // TODO: need to refactor
        int days_constant = 30;

        Item item = new Item();
        Address address = new Address();
        address.setAddressName(itemRequest.getAddress().trim());
        item.setName(itemRequest.getName());
        item.setCategory(itemRequest.getCategory());
        item.setItemType(itemRequest.getItemType());
        item.setCondition(itemRequest.getCondition());
        item.setAmount(itemRequest.getAmount());
        item.setDescription(itemRequest.getDescription());
        item.setAddress(address);
        getAddress(item, itemRequest.getAddress());
        item.setPrice(itemRequest.getPrice());
        item.setModerated(false);
        item.setApproved(false);
        item.setComment("");
        Instant now = Instant.now();
        Instant expirationDateTime = now.plus(Duration.ofDays(days_constant));
        item.setExpirationDateTime(expirationDateTime);
        item = itemRepository.save(item);
        Path itemPath  = Path.of("src/main/resources/pictures/items/item_" + item.getId());
        if (!Files.exists(itemPath)) {
            try {
                Files.createDirectory(itemPath);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return item;
    }

    protected String getUrlParameters(String address) {
        return "{ \"query\": \"" + address.trim() +
                "\", \"count\": " + 1 +
                " }";
    }

    public byte[] getPostData(String address) {
        return  this.getUrlParameters(address).getBytes(StandardCharsets.UTF_8);
    }

    public void getAddress(Item item, String address) {
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
                    item.getAddress().setGeoLat(Double.parseDouble(data.path("geo_lat").asText()));

                if (data.hasNonNull("geo_lon"))
                    item.getAddress().setGeoLon(Double.parseDouble(data.path("geo_lon").asText()));
            }
        }
    }


        public PagedResponse<ItemResponse> getAllItems(UserPrincipal currentUser, int page, int size) {
        validatePageNumberAndSize(page, size);

        //Retrieve Offers
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "created_at");
        Page<Item> offers = itemRepository.findAllItems(pageable);

        if (offers.getNumberOfElements() == 0) {
            return new PagedResponse<>(Collections.emptyList(), offers.getNumber(),
                    offers.getSize(), offers.getTotalElements(), offers.getTotalPages(), offers.isLast());
        }


        Map<String, UserSummary> creatorMap = getItemsCreatorMap(offers.getContent());

        List<ItemResponse> itemResponses = offers.map(offer -> {
            return ModelMapper.mapItemToItemResponse(offer,
                    creatorMap.get(offer.getCreatedBy()));
        }).getContent();

        return new PagedResponse<>(itemResponses, offers.getNumber(),
                offers.getSize(), offers.getTotalElements(), offers.getTotalPages(), offers.isLast());
    }

    public PagedResponse<ItemResponse> getNeedModeratingItemsInAdmin(UserPrincipal currentUser, int page, int size) {
        validatePageNumberAndSize(page, size);

        //Retrieve Offers
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "createdAt");
        Page<Item> offers = itemRepository.findNeedModeratingItemsInAdmin(pageable);

        if (offers.getNumberOfElements() == 0) {
            return new PagedResponse<>(Collections.emptyList(), offers.getNumber(),
                    offers.getSize(), offers.getTotalElements(), offers.getTotalPages(), offers.isLast());
        }


        // Map Items to ItemResponses containing item creator details
        List<String> offerIds = offers.map(Item::getId).getContent();
        Map<String, UserSummary> creatorMap = getItemsCreatorMap(offers.getContent());

        List<ItemResponse> itemResponses = offers.map(offer -> {
            return ModelMapper.mapItemToItemResponse(offer,
                    creatorMap.get(offer.getCreatedBy()));
        }).getContent();

        return new PagedResponse<>(itemResponses, offers.getNumber(),
                offers.getSize(), offers.getTotalElements(), offers.getTotalPages(), offers.isLast());
    }

    public PagedResponse<ItemResponse> getAllItemsForAdmin(UserPrincipal currentUser, int page, int size) {
        validatePageNumberAndSize(page, size);

        //Retrieve Auctions
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "createdAt");
        Page<Item> offers = itemRepository.findAll(pageable);

        if (offers.getNumberOfElements() == 0) {
            return new PagedResponse<>(Collections.emptyList(), offers.getNumber(),
                    offers.getSize(), offers.getTotalElements(), offers.getTotalPages(), offers.isLast());
        }


        // Map Items to ItemResponses containing item creator details
        Map<String, UserSummary> creatorMap = getItemsCreatorMap(offers.getContent());

        List<ItemResponse> itemResponses = offers.map(offer -> {
            return ModelMapper.mapItemToItemResponse(offer,
                    creatorMap.get(offer.getCreatedBy()));
        }).getContent();

        return new PagedResponse<>(itemResponses, offers.getNumber(),
                offers.getSize(), offers.getTotalElements(), offers.getTotalPages(), offers.isLast());
    }


    public ResponseEntity<?> moderate(String itemId, ModerateRequest moderateRequest) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item", "item_id", itemId));

        item.setModerated(true);
        item.setApproved(moderateRequest.isApproved());
        item.setComment(moderateRequest.getComment());
        itemRepository.save(item);

        return new ResponseEntity<>(new ApiResponse(true, "Item has been successfully updated"), HttpStatus.OK);
    }


    public PagedResponse<ItemResponse> getItemsCreatedBy(String username, UserPrincipal currentUser, int page, int size) {
        validatePageNumberAndSize(page, size);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        if (!currentUser.getId().equals(user.getId())) {
            return new PagedResponse<>(Collections.emptyList(), 0,
                    0, 0, 0, false);
        }

        // Retrieve all items created by the given username
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "createdAt");
        Page<Item> items = itemRepository.findByCreatedBy(user.getId(), pageable);

        if (items.getNumberOfElements() == 0) {
            return new PagedResponse<>(Collections.emptyList(), items.getNumber(),
                    items.getSize(), items.getTotalElements(), items.getTotalPages(), items.isLast());
        }

        // Map Items to itemResponses containing items creator details

        UserSummary creatorSummary = new UserSummary(user.getId(), user.getUsername(), isAdmin(user), user.getLogo());

        List<ItemResponse> itemResponses = items.map(item -> {
            return ModelMapper.mapItemToItemResponse(item,
                    creatorSummary);
        }).getContent();

        return new PagedResponse<>(itemResponses, items.getNumber(),
                items.getSize(), items.getTotalElements(), items.getTotalPages(), items.isLast());
    }

    public PagedResponse<ItemResponse> getUserItemsCreatedBy(String username, UserPrincipal currentUser, int page, int size) {
        validatePageNumberAndSize(page, size);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        // Retrieve all items created by the given username
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "created_at");
        Page<Item> items = itemRepository.findUserByCreatedBy(user.getId(), pageable);

        if (items.getNumberOfElements() == 0) {
            return new PagedResponse<>(Collections.emptyList(), items.getNumber(),
                    items.getSize(), items.getTotalElements(), items.getTotalPages(), items.isLast());
        }

        // Map Items to itemResponses containing items creator details

        UserSummary creatorSummary = new UserSummary(user.getId(), user.getUsername(), isAdmin(user), user.getLogo());

        List<ItemResponse> itemResponses = items.map(item -> {
            return ModelMapper.mapItemToItemResponse(item,
                    creatorSummary);
        }).getContent();

        return new PagedResponse<>(itemResponses, items.getNumber(),
                items.getSize(), items.getTotalElements(), items.getTotalPages(), items.isLast());
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

    Map<String, UserSummary> getItemsCreatorMap(List<Item> offers) {
        // Get Items Creator details of the given list of items
        List<String> creatorIds = offers.stream()
                .map(Item::getCreatedBy)
                .distinct()
                .collect(Collectors.toList());

        List<User> creators = userRepository.findByIdIn(creatorIds);

        return creators.stream().collect(Collectors.toMap(User::getId, u -> new UserSummary(u.getId(), u.getUsername(), isAdmin(u), u.getLogo())));
    }

    public ItemResponse getItemById(String pollId, UserPrincipal currentUser) {
        Item item = itemRepository.findById(pollId).orElseThrow(
                () -> new ResourceNotFoundException("Item", "id", pollId));

        // Retrieve item creator details
        User creator = userRepository.findById(item.getCreatedBy())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", item.getCreatedBy()));


        List<Review> reviews = reviewRepository.findAllReviewsForUser(creator);
        double avgScore = 0.0;
        for (Review review : reviews) {
            avgScore += review.getScore();
        }

        double score = reviews.size() == 0 ? 0 : avgScore/reviews.size();

        UserSummary creatorSummary = new UserSummary(creator.getId(), creator.getUsername(), isAdmin(creator), creator.getLogo(), score, creator.getRegistrationDate());

        return ModelMapper.mapItemToItemResponse(item,
                creatorSummary);
    }

    private void validatePageNumberAndSize(int page, int size) {
        if (page < 0) {
            throw new BadRequestException("Page number cannot be less than zero.");
        }

        if (size > AppConstants.MAX_PAGE_SIZE) {
            throw new BadRequestException("Page size must not be greater than " + AppConstants.MAX_PAGE_SIZE);
        }
    }


    public PagedResponse<ItemResponse> getSearchingItems(UserPrincipal currentUser, int page, int size, SearchRequest searchRequest) {
        validatePageNumberAndSize(page, size);

        //Retrieve Offers
        Pageable pageable = PageRequest.of(page, size);
        if (searchRequest.getMinPrice() == null) {
            searchRequest.setMinPrice(0L);
        }
        if (searchRequest.getMaxPrice() == null) {
            searchRequest.setMaxPrice(Long.MAX_VALUE);
        }
        Page<Item> offers = itemRepository.findSearchingItems(searchRequest.getQuery(), searchRequest.getCategory(), searchRequest.getMinPrice(), searchRequest.getMaxPrice(), pageable);

        if (offers.getNumberOfElements() == 0) {
            return new PagedResponse<>(Collections.emptyList(), offers.getNumber(),
                    offers.getSize(), offers.getTotalElements(), offers.getTotalPages(), offers.isLast());
        }


        // Map Items to ItemResponses containing item creator details
        Map<String, UserSummary> creatorMap = getItemsCreatorMap(offers.getContent());

        List<ItemResponse> itemResponses = offers.map(offer -> {
            return ModelMapper.mapItemToItemResponse(offer,
                    creatorMap.get(offer.getCreatedBy()));
        }).getContent();

        return new PagedResponse<>(itemResponses, offers.getNumber(),
                offers.getSize(), offers.getTotalElements(), offers.getTotalPages(), offers.isLast());
    }
}
