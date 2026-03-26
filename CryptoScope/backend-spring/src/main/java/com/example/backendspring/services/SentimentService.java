package com.example.backendspring.services;

import com.example.backendspring.entities.Sentiment;
import com.example.backendspring.repositories.SentimentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service layer responsible for handling sentiment-related business logic.
 * Acts as an intermediary between the controller and the data repository.
 */

@Service
@RequiredArgsConstructor
public class SentimentService {

    private final SentimentRepository sentimentRepository;

    public List<Sentiment> getAll() {
        return sentimentRepository.findAll();
    }
}
