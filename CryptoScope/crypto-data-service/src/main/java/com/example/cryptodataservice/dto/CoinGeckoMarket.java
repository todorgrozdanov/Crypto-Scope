package com.example.cryptodataservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CoinGeckoMarket {
    private String id;
    private Double current_price;
    private Double ath;
    private Double price_change_24h;
    private Double price_change_percentage_24h;
    private Double price_change_percentage_7d_in_currency;
    private Double price_change_percentage_30d_in_currency;
    private Long total_volume;
    private Long market_cap;
    private Integer market_cap_rank;
    private Long circulating_supply;
}


