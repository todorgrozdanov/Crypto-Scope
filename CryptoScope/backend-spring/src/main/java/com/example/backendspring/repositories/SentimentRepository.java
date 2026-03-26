package com.example.backendspring.repositories;

import com.example.backendspring.entities.Sentiment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SentimentRepository extends JpaRepository<Sentiment, Long> {
}
