package com.example.demo.model;

import com.example.demo.model.audit.UserDateAudit;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import javax.validation.constraints.NotNull;

import javax.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "items")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Item extends UserDateAudit {
    @Id
    @GeneratedValue(generator="system-uuid")
    @GenericGenerator(name="system-uuid", strategy = "uuid")
    private String id;
    private String name;
    private String category;
    private String itemType;
    private String condition;
    private Long amount;
    private String description;
    private Long price;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "ADDRESS_ID")
    private Address address;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "item_id", referencedColumnName = "id", updatable = false)
    List<Report> reports = new ArrayList<>();

    // for moderate Item
    private boolean isModerated;
    private boolean isApproved;
    private String comment;

    @NotNull
    private Instant expirationDateTime;

    public void addReport(Report report){
        reports.add(report);
        report.setItemId(this.getId());
    }
}
