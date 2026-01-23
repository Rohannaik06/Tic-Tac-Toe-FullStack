package com.example.demo.repository;
import com.example.demo.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PlayerRepository extends JpaRepository<Player, Long> {
    // Automatically gets top 10 players sorted by wins
    List<Player> findTop10ByOrderByWinsDesc();
    Player findByUsername(String username);
}