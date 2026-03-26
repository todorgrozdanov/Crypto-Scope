//package com.example.backendspring.entities;
//
//
//import jakarta.persistence.*;
//import lombok.Getter;
//
//import java.util.List;
//import java.util.Set;
//
//@Entity
//@Table(name = "crypto", uniqueConstraints = @UniqueConstraint(columnNames = "ticker"))
//@Getter
//public class Crypto {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(nullable = false)
//    private String name;
//
//    @Column(nullable = false)
//    private String coinGeckoId;
//
//    @Column(nullable = false, unique = true)
//    private String ticker;
//
//    @Column(nullable = false, unique = true)
//    private String imageUrl;
//
//    @OneToMany(mappedBy = "crypto", cascade = CascadeType.ALL, orphanRemoval = true)
//    private Set<Price> prices;
//
//    @OneToMany(mappedBy = "crypto")
//    private List<CryptoOnChain> cryptoOnChains;
//}
//
