package com.example.backendspring.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "price_predictions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PricePrediction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "crypto_id")
//    private Crypto crypto;

    @Column(name = "crypto_id", nullable = false)
    private Long cryptoId;

    @Column(name = "predicted_date")
    private LocalDate predictedDate;

    @Column(name = "predicted_close", precision = 20, scale = 10)
    private BigDecimal predictedClose;

    @Column(precision = 5, scale = 4)
    private BigDecimal confidence;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
