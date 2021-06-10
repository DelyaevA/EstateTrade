package com.example.demo.model;

import com.example.demo.model.audit.UserDateAudit;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name="auctions")
public class Auction extends UserDateAudit {
    @Id
    @GeneratedValue(generator="system-uuid")
    @GenericGenerator(name="system-uuid", strategy = "uuid")
    private String id;

    private String name;
    private String category;
    private String description;
    private String condition;
    private Long minPrice;
    private Long maxPrice;
    private Long endPrice;
    private String pictures;
    private String auctionTime;
    private String daysAction;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "ADDRESS_ID")
    private Address address;

    @OneToMany(
            mappedBy = "auction",
            cascade = CascadeType.ALL,
            fetch = FetchType.EAGER
    )
    private List<Bet> bets = new ArrayList<>();

    // for moderate Auction
    private boolean isModerated;
    private boolean isApproved;
    private boolean isFreeze;
    private Instant freezeDataTime;
    private String comment;

    @NotNull
    private Instant expirationDateTime;

    public void setFreeze(boolean freeze) {
        isFreeze = freeze;
    }
}
