//package com.example.backendspring.entities;
//
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//import java.time.LocalDate;
//import java.util.List;
//
//@Entity
//@Data
//public class OnChain {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    private LocalDate date;
//
//    private Long activeAddresses;
//
//    private Long transactionsCount;
//
//    private Float exchangeInflow;
//
//    private Long whaleTransactions;
//
//    private Float nvt;
//
//    private Float mvrv;
//
//    @OneToMany(mappedBy = "onChain")
//    private List<CryptoOnChain> cryptoOnChains;
//}
