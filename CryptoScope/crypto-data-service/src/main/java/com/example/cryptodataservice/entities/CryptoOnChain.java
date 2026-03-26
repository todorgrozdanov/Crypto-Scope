package com.example.cryptodataservice.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class CryptoOnChain {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "crypto_id", nullable = false)
    private Crypto crypto;

    @ManyToOne
    @JoinColumn(name = "on_chain_id", nullable = false)
    private OnChain onChain;
}



