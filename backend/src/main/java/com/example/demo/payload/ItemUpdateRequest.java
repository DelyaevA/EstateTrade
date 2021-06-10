package com.example.demo.payload;

import com.example.demo.model.Address;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ItemUpdateRequest {
    //private String id;
    private String name;
    private String category;
    private String itemType;
    private String condition;
    private Long amount;
    private String description;
    private String address;
    private Long price;
}
