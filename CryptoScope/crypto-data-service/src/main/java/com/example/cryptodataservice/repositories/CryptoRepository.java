package com.example.cryptodataservice.repositories;


import com.example.cryptodataservice.entities.Crypto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CryptoRepository extends JpaRepository<Crypto, Long> {
    Crypto findByTicker(String ticker);
    Crypto findByCoinGeckoId(String ticker);
}
