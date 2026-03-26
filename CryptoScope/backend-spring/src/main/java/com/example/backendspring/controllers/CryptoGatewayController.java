package com.example.backendspring.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

/**
 * REST controller that acts as a gateway between the frontend
 * and an external crypto-data service.
 *
 * This controller forwards requests to another backend service
 * responsible for fetching crypto-related data (prices, OHLCV, etc.).
 */

@RestController
@RequestMapping("/api/crypto")
@CrossOrigin(origins = "https://dasclient.z1.web.core.windows.net")
@RequiredArgsConstructor
public class CryptoGatewayController {

    private final RestTemplate restTemplate;

    @GetMapping
    public ResponseEntity<?> getAll() {
        String url = "https://das-backend-8081.azurewebsites.net/api/crypto";
        ResponseEntity<?> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                Object.class
        );
        return ResponseEntity.ok(response.getBody());
    }

    @GetMapping("/{coinGeckoId}")
    public ResponseEntity<?> getOne(@PathVariable String coinGeckoId) {
        String url = "https://das-backend-8081.azurewebsites.net/api/crypto/" + coinGeckoId;
        ResponseEntity<?> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                Object.class
        );
        return ResponseEntity.ok(response.getBody());
    }

    @GetMapping("/{coinGeckoId}/ohlcv")
    public ResponseEntity<?> getOhlcv(
            @PathVariable String coinGeckoId,
            @RequestParam String timeframe
    ) {
        String url = "https://das-backend-8081.azurewebsites.net/api/crypto/"
                + coinGeckoId + "/ohlcv?timeframe=" + timeframe;
        ResponseEntity<?> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                Object.class
        );
        return ResponseEntity.ok(response.getBody());
    }
}
