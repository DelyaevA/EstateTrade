package com.example.demo.payload;

import com.example.demo.model.Report;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserResponse {
    private String userId;
    private String username;
    private String email;
    private String avatar;
    private boolean banned;
    private List<Report> reports;


    public UserResponse(String userId, String username, String email, String logo) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.avatar = logo;
    }

    public UserResponse(String userId, String username, String email, String avatar, boolean banned) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.avatar = avatar;
        this.banned = banned;
    }
}
