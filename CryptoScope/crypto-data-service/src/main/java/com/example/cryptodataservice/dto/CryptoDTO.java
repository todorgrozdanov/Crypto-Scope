package com.example.cryptodataservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CryptoDTO {
    private Long id;
    private String name;
    private String coinGeckoId;
    private String ticker;
    private String imageUrl;
}
