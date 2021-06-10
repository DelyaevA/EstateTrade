package com.example.demo.controller;

import com.example.demo.exception.AppException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Item;
import com.example.demo.model.Role;
import com.example.demo.model.RoleName;
import com.example.demo.model.User;
import com.example.demo.payload.*;
import com.example.demo.repository.ItemRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.CurrentUser;
import com.example.demo.security.UserPrincipal;
import com.example.demo.service.ItemService;
import com.example.demo.util.AppConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.util.Set;

@RestController
@RequestMapping("/api")
public class ItemController {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private ItemService itemService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/items")
    public PagedResponse<ItemResponse> getAllItems(@CurrentUser UserPrincipal currentUser,
                                                   @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
                                                   @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        return itemService.getAllItems(currentUser, page, size);
    }

    @GetMapping("/items/admin")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public PagedResponse<ItemResponse> getAllItemsForAdmin(@CurrentUser UserPrincipal currentUser,
                                                          @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
                                                          @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        return itemService.getAllItemsForAdmin(currentUser, page, size);
    }

    @PostMapping("/items/search")
    public PagedResponse<ItemResponse> getSearchingItems(@CurrentUser UserPrincipal currentUser,
                                                   @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
                                                   @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
                                                         @Valid @RequestBody SearchRequest searchRequest) {
        return itemService.getSearchingItems(currentUser, page, size, searchRequest);
    }

    @PostMapping("/items")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ItemResponse createNewItem(@Valid @RequestBody ItemRequest itemRequest,
                                       @CurrentUser UserPrincipal currentUser) {
        Item item = itemService.createItem(itemRequest);


        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest().path("/{itemId}")
                .buildAndExpand(item.getId()).toUri();
        return itemService.getItemById(item.getId(), currentUser);
        //TODO: Рефактор long to itemResponse
    }

    @GetMapping("/items/{itemId}")
    public ItemResponse getItemById(@CurrentUser UserPrincipal currentUser,
                                 @PathVariable(value = "itemId") String itemId) {
        return itemService.getItemById(itemId, currentUser);
    }


    @PutMapping("/items/{itemId}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> updateItem(@Valid @RequestBody ItemUpdateRequest itemRequest,
                                        @PathVariable String itemId,
                                        @CurrentUser UserPrincipal userPrincipal) {
        Item item = itemService.updateItem(itemRequest, itemId, userPrincipal);

        return new ResponseEntity<>(new ApiResponse(true, "Товар успешно обновлен!"), HttpStatus.OK);
    }

    @PutMapping("/admin/items/{itemId}/changeCategory")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> changeCategory(@RequestBody ChangeCategoryRequest changeCategoryRequest, @PathVariable String itemId) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item", "item_id", changeCategoryRequest.getCategory()));

        item.setCategory(changeCategoryRequest.getCategory());
        itemRepository.save(item);
        return new ResponseEntity<>(new ApiResponse(true, "User has been gotten a new authority successfully"), HttpStatus.OK);
    }

    @PutMapping("/item/{itemId}")
    public ResponseEntity<?> updateItemByUser(@PathVariable("itemId") String itemId,
                                              @RequestBody ItemUpdateRequest itemRequest){
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item", "item_id", itemId));
        item.setName(itemRequest.getName());
        item.setPrice(itemRequest.getPrice());
        item.setCategory(itemRequest.getCategory());
        item.setItemType(itemRequest.getItemType());
        item.setCondition(itemRequest.getCondition());
        item.setAmount(itemRequest.getAmount());
        item.setDescription(itemRequest.getDescription());
        //item.setAddress(itemRequest.getAddress());

        itemRepository.save(item);

        return new ResponseEntity<>(new ApiResponse(true, "Item updated successfully"), HttpStatus.CREATED);
    }

    //TODO: allow delete item only for admins or currentUser
    @DeleteMapping("/items/{itemId}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> delete(@PathVariable String itemId) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item", "item_id", itemId));
        itemRepository.delete(item);
        return new ResponseEntity<>(new ApiResponse(true, "Item deleted successfully"), HttpStatus.OK);
    }

    @DeleteMapping("/item/{itemId}")
    public ResponseEntity<?> deleteByUser(@PathVariable("itemId") String itemId,
                                          @CurrentUser UserPrincipal userPrincipal){
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item", "item_id", itemId));
        User user = userRepository.findById(item.getCreatedBy())
                .orElseThrow(() -> new ResourceNotFoundException("User", "not found id", item.getCreatedBy()));
        if (user.getId().equals(userPrincipal.getId())) {
            itemRepository.delete(item);
            return new ResponseEntity<>(new ApiResponse(true, "Item deleted successfully"), HttpStatus.OK);
        }
        else
            return new ResponseEntity<>(new ApiResponse(false, "Item didn't deleted"), HttpStatus.BAD_REQUEST);
    }

    @PutMapping("/admin/items/{itemId}/moderate")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> moderate(@PathVariable String itemId, @Valid @RequestBody ModerateRequest moderateRequest) {
        return itemService.moderate(itemId, moderateRequest);
    }
}
