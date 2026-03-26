//package com.example.backendspring.repositories;
//
//import org.springframework.data.jpa.repository.JpaRepository;
//import com.example.backendspring.entities.Price;
//
//import java.time.LocalDate;
//import java.util.List;
//
//public interface PriceRepository extends JpaRepository<Price, Long> {
//    List<Price> findByCryptoIdOrderByDateAsc(Long cryptoId);
//
//    List<Price> findByCryptoIdAndDateAfterOrderByDateAsc(Long cryptoId, LocalDate start);
//}