package com.example.backendspring.controllers;

import com.example.backendspring.dto.SentimentDTO;
import com.example.backendspring.entities.Sentiment;
import com.example.backendspring.mapper.SentimentMapper;
import com.example.backendspring.repositories.SentimentRepository;
import com.example.backendspring.services.SentimentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST controller responsible for exposing sentiment-related API endpoints.
 * It handles HTTP requests and returns sentiment data to the client.
 */

@RestController
@RequestMapping("/api/sentiment")
@CrossOrigin(origins = "https://dasclient.z1.web.core.windows.net")
@RequiredArgsConstructor
public class SentimentController {

    private final SentimentService sentimentService;
    private final SentimentMapper sentimentMapper;

    @GetMapping
    public ResponseEntity<List<SentimentDTO>> getSentimentList() {
        List<Sentiment> sentiments = sentimentService.getAll();
        return ResponseEntity.ok(sentimentMapper.toDto(sentiments));
    }
}
