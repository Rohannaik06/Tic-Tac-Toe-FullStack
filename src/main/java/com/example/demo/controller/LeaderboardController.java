package com.example.demo.controller;

import com.example.demo.model.Player;
import com.example.demo.repository.PlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
@CrossOrigin(origins = "*")
public class LeaderboardController {

    @Autowired
    private PlayerRepository playerRepository;

    // 1. Get Top 10 for index.html
    @GetMapping
    public List<Player> getLeaderboard() {
        return playerRepository.findTop10ByOrderByWinsDesc();
    }

    // 2. Update Wins when game ends
    @PostMapping("/win")
    public void recordWin(@RequestParam String username) {
        System.out.println(">>> DEBUG: Received win request for: " + username);
        
        Player player = playerRepository.findByUsername(username);
        if (player != null) {
            player.setWins(player.getWins() + 1);
            playerRepository.save(player);
            System.out.println(">>> SUCCESS: " + username + " now has " + player.getWins() + " wins!");
        } else {
            System.out.println(">>> ERROR: Player '" + username + "' not found in database.");
        }
    }
}