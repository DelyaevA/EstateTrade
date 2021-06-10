package com.example.demo.payload;

import com.example.demo.model.Bet;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AuctionResponseMinInfo {
    private String id;
    private String name;
    private String category;
    private String condition;
    private boolean isModerated;
    private boolean isApproved;
    private boolean isFreeze;
}
