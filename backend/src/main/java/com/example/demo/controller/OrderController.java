package com.example.demo.controller;

import com.example.demo.model.Order;
import com.example.demo.model.User;
import com.example.demo.payload.OrderRequest;
import com.example.demo.payload.OrderSummary;
import com.example.demo.payload.UserRequest;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/order")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping("/")
    public ArrayList<OrderSummary> getAllOrders() {
        List<Order> orderList = orderRepository.findAll();
        ArrayList<OrderSummary> orderSummaries = new ArrayList<>();
        for (Order order : orderList) {
            OrderSummary orderSummary = new OrderSummary(order.getId(), order.getTitle());
            orderSummaries.add(orderSummary);
        }
        return orderSummaries;
    }

    @RequestMapping(value="/add", method=RequestMethod.POST)
    public String createOrder(@Valid @RequestBody OrderRequest orderRequest) {
        Order order = new Order(orderRequest.getOrder());
        orderRepository.save(order);
        return "Order has been added";
    }

    @PostMapping("/edit/{id}")
    public String edit(@PathVariable long id, @RequestBody OrderRequest orderRequest) {
        Order order = orderRepository.getOne(id);
        order.setTitle(orderRequest.getOrder());
        orderRepository.save(order);
        return "Order has been updated";
    }



    @PostMapping("/delete/{id}")
    public String delete(@PathVariable Long id){
        Order order = orderRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Invalid order Id:" + id));;

        orderRepository.delete(order);

        return "Order has been deleted";
    }

}
