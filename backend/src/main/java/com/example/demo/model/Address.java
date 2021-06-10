package com.example.demo.model;

import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

@Entity
@Table(name = "ADDRESSES")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Address {

    @Id
    @GeneratedValue(generator="system-uuid")
    @GenericGenerator(name="system-uuid", strategy = "uuid")
    private String id;

    @Column(name = "ADDRESS")
    private String addressName;

    @Column(name = "GEO_LON")
    private Double geoLon;

    @Column(name = "GEO_LAT")
    private Double geoLat;
}
