package com.example.cryptodataservice.controllers;


import com.example.cryptodataservice.dto.CryptoDetailedDTO;
import com.example.cryptodataservice.dto.CryptoHomeDTO;
import com.example.cryptodataservice.dto.CryptoOhlcvmDTO;
import com.example.cryptodataservice.entities.Crypto;
import com.example.cryptodataservice.services.CryptoService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@RestController
@RequestMapping("/api/crypto")
@CrossOrigin(origins = {"https://dasclient.z1.web.core.windows.net", "https://das-backend-8080.azurewebsites.net"})
@RequiredArgsConstructor
public class CryptoController {

    private final CryptoService cryptoService;
    @Autowired
    private RestTemplate restTemplate;


    @GetMapping
    public ResponseEntity<List<CryptoHomeDTO>> getAllCryptos() {
        List<CryptoHomeDTO> cryptos = cryptoService.getCryptosWithMarketData();
        return ResponseEntity.ok(cryptos);
    }

    // single crypto with details
    @GetMapping("/{coinGeckoId}")
    public ResponseEntity<CryptoDetailedDTO> getCrypto(@PathVariable String coinGeckoId) {
        return ResponseEntity.ok(cryptoService.getCryptoWithMarketData(coinGeckoId));
    }

    @GetMapping("/{coinGeckoId}/ohlcv")
    public ResponseEntity<List<CryptoOhlcvmDTO>> getCryptoOhlcv(
            @PathVariable String coinGeckoId,
            @RequestParam(defaultValue = "1M") String timeframe
    ) {
        CryptoDetailedDTO cryptoDetails = cryptoService.getCryptoWithMarketData(coinGeckoId);
        List<CryptoOhlcvmDTO> ohlcvData = switch (timeframe.toUpperCase()) {
            case "1H", "1D", "1W" -> cryptoDetails.ohlcvmWeek;
            case "1M" -> cryptoDetails.ohlcvmMonth;
            case "3M" -> cryptoDetails.ohlcvmHalfYear;
            case "1Y" -> cryptoDetails.ohlcvmYear;
            default -> cryptoDetails.ohlcvmMonth;
        };
        return ResponseEntity.ok(ohlcvData);
    }
}