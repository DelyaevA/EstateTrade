package com.example.demo.builders;

import com.example.demo.model.Address;

public class AddressGenerator {

    public static Address generateAddress(){
        return Address.builder()
                .addressName("Воронеж")
                .geoLat(51.6593332)
                .geoLon(39.1969229)
                .build();
    }
}
