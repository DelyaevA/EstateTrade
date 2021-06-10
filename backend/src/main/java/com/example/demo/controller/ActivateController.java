package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Controller
public class ActivateController {

    @GetMapping("/api/activate/0983c227-6c5b-4b8c-9a72-8260a462cfee")
    public void activate(HttpServletResponse response) throws IOException{
        response.sendRedirect(System.getenv("FRONTEND") + "/login");
    }
}
