package com.example.demo.payload;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ItemRequest {
    private String name;
    private String category;
    private String itemType;
    private String condition;
    private Long amount;
    private String description;
    private String address;
    private Long price;
    private MultipartFile[] pictures;
}
