package com.example.demo.controller;

import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Report;
import com.example.demo.model.User;
import com.example.demo.payload.ApiResponse;
import com.example.demo.payload.ItemResponse;
import com.example.demo.payload.PagedResponse;
import com.example.demo.payload.UserResponse;
import com.example.demo.repository.ItemRepository;
import com.example.demo.repository.ReportRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.ItemService;
import com.example.demo.service.ReportService;
import com.example.demo.util.AppConstants;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private ReportRepository reportRepository;

    private ItemRepository itemRepository;

    private UserRepository userRepository;

    private ReportService reportService;

    public ReportController(ReportRepository reportRepository,
                            ItemRepository itemRepository,
                            UserRepository userRepository,
                            ReportService reportService) {
        this.reportRepository = reportRepository;
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
        this.reportService = reportService;
    }

    @GetMapping(path = "/all")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> getAll(){
        return ResponseEntity.ok(reportRepository.findAll());
    }

    @PostMapping(path = "/items/{itemId}")
    //@PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> addReportByItem(@PathVariable("itemId") String itemId,
                                 @RequestBody Report report){
        var item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item", "itemId", itemId));
        item.addReport(report);
        itemRepository.save(item);
        return new ResponseEntity<>(new ApiResponse(true, "Жалоба успешно отправлена!"), HttpStatus.OK);
    }

    @PostMapping("/users/{userId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> addReportByUser(@PathVariable("userId") String userId,
                                       @RequestBody Report report){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        user.addReport(report);
        userRepository.save(user);
        return new ResponseEntity<>(new ApiResponse(true, "Жалоба успешно отправлена!"), HttpStatus.OK);
    }

    @GetMapping(path = "/item/{itemId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> getAllByItemId(@PathVariable("itemId") String itemId){
        return ResponseEntity.ok(reportRepository.getAllByItemId(itemId));
    }

    @GetMapping(path = "/user/{userId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> getAllByUserId(@PathVariable("userId") String userId){
        return ResponseEntity.ok(reportRepository.getAllByUserId(userId));
    }

    @GetMapping(path = "/items")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public PagedResponse<ItemResponse> getAllItemsWithReports(@RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
                                                    @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size){
        return reportService.getAllReportsItems(page, size);
    }

    @GetMapping(path = "/users")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public PagedResponse<UserResponse> getAllUsersWithReports(@RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
                                                              @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size){
        return reportService.getAllReportsUsers(page, size);
    }
}
