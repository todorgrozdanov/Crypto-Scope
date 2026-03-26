package com.example.backendspring.repositories;

import com.example.backendspring.entities.PricePrediction;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface PricePredictionRepository extends JpaRepository<PricePrediction, Long> {
    List<PricePrediction> findByCryptoIdOrderByPredictedDateAsc(Long cryptoId);

    @Modifying
    @Transactional
    @Query("DELETE FROM PricePrediction p WHERE p.cryptoId = :cryptoId")
    void deleteByCryptoId(@Param("cryptoId") Long cryptoId);
}
