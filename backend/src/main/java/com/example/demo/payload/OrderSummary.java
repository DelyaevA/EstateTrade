package com.example.demo.payload;

import com.example.demo.model.Order;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@AllArgsConstructor
@Getter
@Setter
public class OrderSummary {
    private String id;

    private String order;

    public OrderSummary(String order) {

    }
}
