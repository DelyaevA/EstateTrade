package com.example.demo.controller;

import java.io.File;
import java.util.List;

import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Auction;
import com.example.demo.model.Item;
import com.example.demo.payload.ResponseMessage;
import com.example.demo.repository.AuctionRepository;
import com.example.demo.repository.ItemRepository;
import com.example.demo.security.CurrentUser;
import com.example.demo.security.UserPrincipal;
import com.example.demo.service.FilesStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


@Controller
@RequestMapping("/api/files")
public class FilesController {

    @Value("#{'${file.extensions}'.split(',')}")
    private List<String> fileExtensions;

    @Autowired
    FilesStorageService storageService;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private AuctionRepository auctionRepository;

    @PostMapping("/upload/logo")
    public ResponseEntity<ResponseMessage> uploadLogo(@RequestParam("file") MultipartFile file, @CurrentUser UserPrincipal currentUser) {
        String message = "";
        boolean flag = false;
        File file1 = new File(file.getOriginalFilename());
        File dir = new File("src/main/resources/pictures/logo/" + currentUser.getUsername());
        if (dir.listFiles() != null) {
            for (File fileOrig : dir.listFiles()) {
                if (fileOrig.isFile())
                    if (fileOrig.getName().split("_")[0].equals(currentUser.getUsername())) {
                        dir.delete();
                    }
            }
        }
        String extension = storageService.getFileExtension(file1);
        for (String fileExtension : fileExtensions) {
            if (fileExtension.equals(extension)){
                flag = true;
                break;
            }
        }
        try {
            if(flag) {
                storageService.saveLogo(file, currentUser.getUsername());
                message = "Uploaded the file successfully: " + file.getOriginalFilename();
                return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
            }
            else return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
        } catch (Exception e) {
            message = "Could not upload the file: " + file.getOriginalFilename() + "!";
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
        }
    }

    @PostMapping("/pictures/{itemId}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<ResponseMessage> uploadPicture(@RequestParam("file") MultipartFile file, @CurrentUser UserPrincipal currentUser, @PathVariable(value = "itemId") String itemId) {
        String message = "";

        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item", "item_id", itemId));
        if (!item.getCreatedBy().equals(currentUser.getId())) {
            message = "Это не ваше объявления";
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
        }

        try {
            storageService.savePicture(file, itemId);
            message = "Uploaded the file successfully: " + file.getOriginalFilename();
            return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
        } catch (Exception e) {
            message = "Could not upload files";
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
        }
    }

    @PostMapping("/upload/pictures/{itemId}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<ResponseMessage> uploadPicture(@RequestParam("files") MultipartFile[] files, @CurrentUser UserPrincipal currentUser, @PathVariable("itemId") String itemId) {
        String message = "";
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item", "item_id", itemId));
        if (!item.getCreatedBy().equals(currentUser.getId())) {
            message = "Это не ваше объявления";
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
        }


        try {
            storageService.savePictures(files, itemId);
            for (int i = 0; i < files.length; i++) {
                message = "Uploaded the file successfully: " + files[i].getOriginalFilename();
            }
            return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
        } catch (Exception e) {
            message = "Could not upload files";
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
        }
    }

    @PostMapping("/pictures/auction/{auctionId}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<ResponseMessage> uploadAuctionPicture(@RequestParam("file") MultipartFile file, @CurrentUser UserPrincipal currentUser, @PathVariable(value = "auctionId") String auctionId) {
        String message = "";

        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new ResourceNotFoundException("auction", "auction_id", auctionId));
        if (!auction.getCreatedBy().equals(currentUser.getId())) {
            message = "Это не ваш аукцион!";
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
        }

        try {
            storageService.saveAuctionPicture(file, auctionId);
            message = "Uploaded the file successfully: " + file.getOriginalFilename();
            return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
        } catch (Exception e) {
            message = "Could not upload files";
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
        }
    }


    @GetMapping("/avatars/{username}")
    @ResponseBody
    public ResponseEntity<Resource> getLogo(@PathVariable String username) {
        Resource file = storageService.loadLogo(username);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"").body(file);
    }

    @GetMapping("/pictures/{itemId}/{filename}")
    @ResponseBody
    public ResponseEntity<Resource> getPicture(@PathVariable String itemId, @PathVariable String filename) {
        Resource file = storageService.loadPicture(itemId, filename, "item");
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"").body(file);
    }

    @GetMapping("/pictures/auction/{auctionId}/{filename}")
    @ResponseBody
    public ResponseEntity<Resource> getAuctionPicture(@PathVariable String auctionId, @PathVariable String filename) {
        Resource file = storageService.loadAuctionPicture(auctionId, filename, "auction");
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"").body(file);
    }
}