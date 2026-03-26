//package com.example.backendspring.entities;
//
//
//import com.fasterxml.jackson.annotation.JsonIgnore;
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//import java.math.BigDecimal;
//import java.time.LocalDate;
//
//@Entity
//@Table(
//        name = "price",
//        uniqueConstraints = {
//                @UniqueConstraint(columnNames = {"date", "crypto_id"})
//        }
//)
//@Data
//@AllArgsConstructor
//@NoArgsConstructor
//public class Price {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @ManyToOne(optional = false)
//    @JoinColumn(name = "crypto_id", nullable = false)
//    @JsonIgnore
//    private Crypto crypto;
//
//    @Column(nullable = false)
//    private LocalDate date;
//
//    @Column(scale = 10)
//    private BigDecimal open;
//
//    @Column(scale = 10)
//    private BigDecimal high;
//
//    @Column(scale = 10)
//    private BigDecimal low;
//
//    @Column(scale = 10)
//    private BigDecimal close;
//
//    private Long volume;
//
//    private Float rsi;
//    private Float macd;
//    private Float adx;
//    private Float cci;
//    private Float stoch;
//
//    private Float sma_20;
//    private Float sma_50;
//    private Float ema_20;
//    private Float ema_50;
//    private Float wma_20;
//    private Float wma_50;
//    private Float vma_20;
//    private Float vma_50;
//    private Float bb_lower;
//    private Float bb_middle;
//    private Float bb_upper;
//}
