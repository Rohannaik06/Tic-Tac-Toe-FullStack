package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class GameController {

    // This maps http://localhost:8080/ to index.html
    @GetMapping("/")
    public String home() {
        return "forward:/index.html";
    }

    // This maps http://localhost:8080/game to sindex.html
    @GetMapping("/game")
    public String gamePage() {
        // Make sure the filename here matches the filename in your static folder exactly
        return "forward:/sindex.html"; 
    }
}