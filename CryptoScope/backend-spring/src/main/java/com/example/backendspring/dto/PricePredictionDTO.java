package com.example.backendspring.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class PricePredictionDTO {
    private LocalDate predictedDate;
    private BigDecimal predictedClose;
    private BigDecimal confidence;
}
