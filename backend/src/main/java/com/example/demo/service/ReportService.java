package com.example.demo.service;

import com.example.demo.exception.AppException;
import com.example.demo.exception.BadRequestException;
import com.example.demo.model.Item;
import com.example.demo.model.Role;
import com.example.demo.model.RoleName;
import com.example.demo.model.User;
import com.example.demo.payload.ItemResponse;
import com.example.demo.payload.PagedResponse;
import com.example.demo.payload.UserResponse;
import com.example.demo.payload.UserSummary;
import com.example.demo.repository.ItemRepository;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.UserPrincipal;
import com.example.demo.util.AppConstants;
import com.example.demo.util.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    private void validatePageNumberAndSize(int page, int size) {
        if (page < 0) {
            throw new BadRequestException("Page number cannot be less than zero.");
        }

        if (size > AppConstants.MAX_PAGE_SIZE) {
            throw new BadRequestException("Page size must not be greater than " + AppConstants.MAX_PAGE_SIZE);
        }
    }

    public PagedResponse<ItemResponse> getAllReportsItems(int page, int size) {
        validatePageNumberAndSize(page, size);

        //Retrieve Auctions
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "createdAt");
        Page<Item> offers = itemRepository.findAllItemsWithReports(pageable);

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

    Map<String, UserSummary> getItemsCreatorMap(List<Item> offers) {
        // Get Items Creator details of the given list of items
        List<String> creatorIds = offers.stream()
                .map(Item::getCreatedBy)
                .distinct()
                .collect(Collectors.toList());

        List<User> creators = userRepository.findByIdIn(creatorIds);

        return creators.stream().collect(Collectors.toMap(User::getId, u -> new UserSummary(u.getId(), u.getUsername(), isAdmin(u), u.getLogo())));
    }

    public PagedResponse<UserResponse> getAllReportsUsers(int page, int size) {
        validatePageNumberAndSize(page, size);

        // Retrieve Users
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "email");
        Page<User> users = userRepository.findAllUsersWithReports(pageable);

        if(users.getNumberOfElements() == 0) {
            return new PagedResponse<>(Collections.emptyList(), users.getNumber(),
                    users.getSize(), users.getTotalElements(), users.getTotalPages(), users.isLast());
        }

        List<UserResponse> userResponses = users.map(ModelMapper::mapUserToUserResponse).getContent();

        return new PagedResponse<>(userResponses, users.getNumber(),
                users.getSize(), users.getTotalElements(), users.getTotalPages(), users.isLast());
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
}
