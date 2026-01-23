package com.example.demo.controller;

import com.example.demo.model.Player;
import com.example.demo.repository.PlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private PlayerRepository playerRepository;

    /**
     * Handles User Registration.
     * Redirects to login on success or back to signup if username exists.
     */
    @PostMapping("/signup")
    public String signup(@RequestParam String username, @RequestParam String password) {
        // Check if the username is already taken in Supabase
        if (playerRepository.findByUsername(username) != null) {
            return "redirect:/signup.html?error=exists";
        }
        
        Player player = new Player();
        player.setUsername(username); // Using plain username string
        player.setPassword(password);
        player.setWins(0); // Start new players with 0 wins
        
        playerRepository.save(player);
        return "redirect:/login.html?signup=success";
    }

    /**
     * Handles User Login.
     * Redirects to index.html with a 'user' parameter to trigger the profile UI.
     */
    @PostMapping("/login")
    public String login(@RequestParam String username, @RequestParam String password) {
        Player player = playerRepository.findByUsername(username);
        
        // Basic password check (In a real app, use BCrypt password encoding)
        if (player != null && player.getPassword().equals(password)) {
            // Passing the username to index.html to allow the frontend to save it in LocalStorage
            return "redirect:/index.html?user=" + username;
        }
        
        return "redirect:/login.html?error=invalid";
    }

    /**
     * Optional: Simple Logout Redirect
     */
    @GetMapping("/logout")
    public String logout() {
        return "redirect:/index.html";
    }
}