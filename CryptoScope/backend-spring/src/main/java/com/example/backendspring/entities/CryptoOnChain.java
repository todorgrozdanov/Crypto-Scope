//package com.example.backendspring.entities;
//
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//@Entity
//@Data
//public class CryptoOnChain {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @ManyToOne
//    @JoinColumn(name = "crypto_id", nullable = false)
//    private Crypto crypto;
//
//    @ManyToOne
//    @JoinColumn(name = "on_chain_id", nullable = false)
//    private OnChain onChain;
//}
//
//
//
