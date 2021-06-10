package com.example.demo.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@AllArgsConstructor
@Getter
@Setter
@Builder
public class UserSummary {
    private String id;
    private String username;
    private long admin;
    private String avatar;
    private Double score;
    private Date registrationDate;
    private long countUnreadMessages;

    public UserSummary(String id, String username, long admin, String avatar, Double score, Date registrationDate) {
        this.id = id;
        this.username = username;
        this.admin = admin;
        this.avatar = avatar;
        this.score = score;
        this.registrationDate = registrationDate;
    }

    public UserSummary(String id, String username, long admin, String avatar) {
        this.id = id;
        this.username = username;
        this.admin = admin;
        this.avatar = avatar;
    }

    public UserSummary(String id, String username, long admin, String avatar, long countUnreadMessages) {
        this.id = id;
        this.username = username;
        this.admin = admin;
        this.avatar = avatar;
        this.countUnreadMessages = countUnreadMessages;
    }

    public UserSummary(String id, String username, String avatar) {
        this.id = id;
        this.username = username;
        this.avatar = avatar;
    }



    /* private List<OrderSummary> orders;*/
}
