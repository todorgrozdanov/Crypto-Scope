package com.example.cryptodataservice.services;

import com.example.cryptodataservice.dto.CoinGeckoMarket;
import com.example.cryptodataservice.dto.CryptoDetailedDTO;
import com.example.cryptodataservice.dto.CryptoHomeDTO;
import com.example.cryptodataservice.dto.CryptoOhlcvmDTO;
import com.example.cryptodataservice.entities.Crypto;
import com.example.cryptodataservice.entities.Price;
import com.example.cryptodataservice.repositories.CryptoRepository;
import com.example.cryptodataservice.repositories.PriceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CryptoService {

    private final CryptoRepository cryptoRepository;
    private final PriceRepository priceRepository;
    private final RestTemplate restTemplate;

    public CryptoDetailedDTO getCryptoWithMarketData(String coinGeckoId) {
        Crypto crypto = cryptoRepository.findByCoinGeckoId(coinGeckoId);
        System.out.println(crypto);
        System.out.println(crypto.getId());
        List<Price> ohlcvWeek = priceRepository.findByCryptoIdAndDateAfterOrderByDateAsc(
                crypto.getId(),
                LocalDate.now().minusWeeks(1)
        );
        List<Price> ohlcvMonth = priceRepository.findByCryptoIdAndDateAfterOrderByDateAsc(
                crypto.getId(),
                LocalDate.now().minusMonths(1)
        );
        List<Price> ohlcvHalfYear = priceRepository.findByCryptoIdAndDateAfterOrderByDateAsc(
                crypto.getId(),
                LocalDate.now().minusMonths(6)
        );
        List<Price> ohlcvYear = priceRepository.findByCryptoIdAndDateAfterOrderByDateAsc(
                crypto.getId(),
                LocalDate.now().minusYears(1)
        );
        List<Price> ohlcvTenYears = priceRepository.findByCryptoIdAndDateAfterOrderByDateAsc(
                crypto.getId(),
                LocalDate.now().minusYears(10)
        );
        List<Price> ohlcvAll = priceRepository.findByCryptoIdOrderByDateAsc(
                crypto.getId()
        );

        String url = String.format(
                "https://api.coingecko.com/api/v3/coins/markets" +
                        "?vs_currency=usd&ids=%s&price_change_percentage=24h,7d,30d",
                coinGeckoId
        );

        ResponseEntity<List<CoinGeckoMarket>> response = restTemplate.exchange(
                url, HttpMethod.GET, null,
                new ParameterizedTypeReference<List<CoinGeckoMarket>>() {}
        );

        List<CoinGeckoMarket> body = response.getBody();
        if (body == null || body.isEmpty()) {
            return null;
        }

        CoinGeckoMarket market = body.get(0);

        return CryptoDetailedDTO.builder()
                .id(crypto.getId())
                .name(crypto.getName())
                .coinGeckoId(crypto.getCoinGeckoId())
                .ticker(crypto.getTicker())
                .imageUrl(crypto.getImageUrl())

                .priceNow(safeBigDecimal(market.getCurrent_price()))
                .ath(safeBigDecimal(market.getAth()))
                .percentChangeYesterday(safeBigDecimal(market.getPrice_change_percentage_24h()))
                .percentChangeWeek(safeBigDecimal(market.getPrice_change_percentage_7d_in_currency()))
                .percentChangeMonth(safeBigDecimal(market.getPrice_change_percentage_30d_in_currency()))
                .volume(market.getTotal_volume())
                .marketCap(market.getMarket_cap())

                .marketCapRank(market.getMarket_cap_rank())
                .circulatingSupply(market.getCirculating_supply())
                .ohlcvmWeek(convertToDto(ohlcvWeek))
                .ohlcvmMonth(convertToDto(ohlcvMonth))
                .ohlcvmHalfYear(convertToDto(ohlcvHalfYear))
                .ohlcvmYear(convertToDto(ohlcvYear))
                .ohlcvmTenYears(convertToDto(ohlcvTenYears))
                .ohlcvmAll(convertToDto(ohlcvAll))
                .build();
    }

    public List<CryptoHomeDTO> getCryptosWithMarketData() {
        List<Crypto> cryptos = cryptoRepository.findAll();

        if (cryptos.isEmpty()) {
            return List.of();
        }

        List<String> coinGeckoIds = cryptos.stream()
                .map(Crypto::getCoinGeckoId)
                .toList();

        List<CoinGeckoMarket> marketData = fetchMarketDataBatch(coinGeckoIds);
        Map<String, CoinGeckoMarket> marketMap = marketData.stream()
                .collect(Collectors.toMap(CoinGeckoMarket::getId, m -> m));

        return cryptos.stream()
                .map(crypto -> {
                    CoinGeckoMarket market = marketMap.get(crypto.getCoinGeckoId());
                    return new CryptoHomeDTO(
                            crypto.getId(),
                            crypto.getName(),
                            crypto.getCoinGeckoId(),
                            crypto.getTicker(),
                            crypto.getImageUrl(),
                            safeBigDecimal(market != null ? market.getCurrent_price() : null),
                            safeBigDecimal(market != null ? market.getAth() : null),
                            safeBigDecimal(market != null ? market.getPrice_change_percentage_24h() : null),
                            safeBigDecimal(market != null ? market.getPrice_change_percentage_7d_in_currency() : null),
                            safeBigDecimal(market != null ? market.getPrice_change_percentage_30d_in_currency() : null),
                            market != null ? market.getTotal_volume() : 0L,
                            market != null ? market.getMarket_cap() : 0L
                    );
                })
                .toList();
    }

    private List<CryptoOhlcvmDTO> convertToDto(List<Price> prices) {
        return prices.stream()
                .map(price -> {
                    CryptoOhlcvmDTO dto = new CryptoOhlcvmDTO();
                    dto.setDate(price.getDate());
                    dto.setOpen(price.getOpen());
                    dto.setHigh(price.getHigh());
                    dto.setLow(price.getLow());
                    dto.setClose(price.getClose());
                    dto.setVolume(price.getVolume());
                    dto.setRsi(price.getRsi());
                    dto.setMacd(price.getMacd());
                    dto.setAdx(price.getAdx());
                    dto.setCci(price.getCci());
                    dto.setStoch(price.getStoch());
                    dto.setSma_20(price.getSma_20());
                    dto.setSma_50(price.getSma_50());
                    dto.setEma_20(price.getEma_20());
                    dto.setEma_50(price.getEma_50());
                    dto.setWma_20(price.getWma_20());
                    dto.setWma_50(price.getWma_50());
                    dto.setVma_20(price.getVma_20());
                    dto.setVma_50(price.getVma_50());
                    dto.setBb_lower(price.getBb_lower());
                    dto.setBb_middle(price.getBb_middle());
                    dto.setBb_upper(price.getBb_upper());
                    return dto;
                })
                .collect(Collectors.toList());
    }



    private BigDecimal safeBigDecimal(Double value) {
        return value != null ? BigDecimal.valueOf(value) : BigDecimal.ZERO;
    }

    private List<CoinGeckoMarket> fetchMarketDataBatch(List<String> coinGeckoIds) {
        List<CoinGeckoMarket> allResults = new ArrayList<>();
        List<List<String>> chunks = chunkList(coinGeckoIds, 250);

        for (int i = 0; i < chunks.size(); i++) {
            List<String> chunk = chunks.get(i);
            String ids = String.join(",", chunk);
            String url = String.format(
                    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=%s&price_change_percentage=24h,7d,30d",
                    ids
            );

            try {
                ResponseEntity<List<CoinGeckoMarket>> response = restTemplate.exchange(
                        url, HttpMethod.GET, null,
                        new ParameterizedTypeReference<List<CoinGeckoMarket>>() {}
                );
                allResults.addAll(response.getBody() != null ? response.getBody() : List.of());

                if (i < chunks.size() - 1) {
                    try {
                        Thread.sleep(1000);
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    }
                }
            } catch (Exception e) {
                System.err.println("Failed to fetch CoinGecko data for chunk: " + ids + " - " + e.getMessage());
            }
        }
        return allResults;
    }

    private <T> List<List<T>> chunkList(List<T> list, int chunkSize) {
        List<List<T>> chunks = new ArrayList<>();
        for (int i = 0; i < list.size(); i += chunkSize) {
            chunks.add(list.subList(i, Math.min(i + chunkSize, list.size())));
        }
        return chunks;
    }

    public Crypto getCryptoByTicker(String ticker) {
        return cryptoRepository.findByTicker(ticker);
    }

    public List<Price> getPricesForCrypto(Long cryptoId) {
        return priceRepository.findByCryptoIdOrderByDateAsc(cryptoId);
    }

    public Crypto getCryptoById(Long cryptoId) {
        return cryptoRepository.findById(cryptoId)
                .orElseThrow(() -> new RuntimeException("Crypto not found: " + cryptoId));
    }

    public Crypto getCryptoByCoinGeckoId(String coinGeckoId) {
        Crypto crypto = cryptoRepository.findByCoinGeckoId(coinGeckoId);
        if (crypto == null) {
            throw new RuntimeException("Crypto not found: " + coinGeckoId);
        }
        return crypto;
    }
}
