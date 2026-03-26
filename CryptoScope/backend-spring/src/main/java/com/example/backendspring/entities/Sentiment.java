package com.example.backendspring.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;

@Entity
@Data
public class Sentiment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;

    private String url;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String body;

    private Float sentiment;

    private String finbertSentiment;
}
