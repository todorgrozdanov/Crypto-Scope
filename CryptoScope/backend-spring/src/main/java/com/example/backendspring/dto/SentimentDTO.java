package com.example.backendspring.dto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SentimentDTO {
    private LocalDate date;

    private String url;

    private String title;

    private String body;

    private Float sentiment;

    private String finbertSentiment;
}
