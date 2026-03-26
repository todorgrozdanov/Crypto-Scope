//package com.example.backendspring.controllers;
//
//import com.example.backendspring.dto.CryptoDetailedDTO;
//import com.example.backendspring.dto.CryptoHomeDTO;
//import com.example.backendspring.dto.CryptoOhlcvmDTO;
//import com.example.backendspring.dto.PricePredictionDTO;
//import com.example.backendspring.entities.Crypto;
//import com.example.backendspring.entities.Price;
//import com.example.backendspring.services.CryptoService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.client.RestTemplate;
//import com.example.backendspring.services.PredictionService;
//import org.springframework.beans.factory.annotation.Autowired;
//import java.util.List;
//import com.fasterxml.jackson.databind.JsonNode;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.fasterxml.jackson.core.type.TypeReference;
//
//@RestController
//@RequestMapping("/api/crypto")
//@CrossOrigin(origins = "http://localhost:3000")
//@RequiredArgsConstructor
//public class CryptoController {
//
//    private final CryptoService cryptoService;
//    @Autowired
//    private RestTemplate restTemplate;
//
////    private final PredictionService predictionService;
////
////    @GetMapping("/{coinGeckoId}/lstm/predict")
////    public ResponseEntity<List<PricePredictionDTO>> getCryptoPredictions(
////            @PathVariable String coinGeckoId,
////            @RequestParam(value = "days", defaultValue = "7") int days // 7 or 30
////    ) {
////        try {
////            Crypto crypto = cryptoService.getCryptoByCoinGeckoId(coinGeckoId);
////            String url = "http://localhost:5001/lstm/predict/" + crypto.getId() + "?days=" + days;
////
////            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
////
////            ObjectMapper mapper = new ObjectMapper();
////            JsonNode root = mapper.readTree(response.getBody());
////            List<Double> predictions = mapper.convertValue(
////                    root.get("predictions"), new TypeReference<List<Double>>() {}
////            );
////
////            Double confidence = root.has("confidence")
////                    ? root.get("confidence").asDouble()
////                    : 0.0;
////
////            if (predictions != null && !predictions.isEmpty()) {
////                predictionService.savePredictions(
////                        crypto.getId(),
////                        predictions,
////                        confidence
////                );
////                return ResponseEntity.ok(
////                        predictionService.getPredictions(crypto.getId())
////                );
////            }
////            return ResponseEntity.ok(List.of());
////
////        } catch (Exception e) {
////            System.err.println("Prediction error: " + e.getMessage());
////            return ResponseEntity.ok(List.of());
////        }
////    }
////
////    @GetMapping("/{coinGeckoId}/xgb/predict")
////    public ResponseEntity<String> getPriceMovementPredictions(
////            @PathVariable String coinGeckoId
////    ) {
////        try {
////            Crypto crypto = cryptoService.getCryptoByCoinGeckoId(coinGeckoId);
////            String url = "http://localhost:5001/xgb/predict/" + crypto.getId();
////
////            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
////
////            ObjectMapper mapper = new ObjectMapper();
////            JsonNode root = mapper.readTree(response.getBody());
////            Integer prediction = mapper.convertValue(
////                    root.get("prediction"), new TypeReference<Integer>() {}
////            );
////
////
////            return ResponseEntity.ok(prediction == 0 ? "negative" : prediction == 1 ? "neutral" : "positive");
////
////        } catch (Exception e) {
////            System.err.println("Prediction error: " + e.getMessage());
////            return ResponseEntity.ok("Error");
////        }
////    }
////
//
//
//    @GetMapping
//    public ResponseEntity<List<CryptoHomeDTO>> getAllCryptos() {
//        List<CryptoHomeDTO> cryptos = cryptoService.getCryptosWithMarketData();
//        return ResponseEntity.ok(cryptos);
//    }
//
//    // single crypto with details
//    @GetMapping("/{coinGeckoId}")
//    public ResponseEntity<CryptoDetailedDTO> getCrypto(@PathVariable String coinGeckoId) {
//        return ResponseEntity.ok(cryptoService.getCryptoWithMarketData(coinGeckoId));
//    }
//
//    @GetMapping("/{coinGeckoId}/ohlcv")
//    public ResponseEntity<List<CryptoOhlcvmDTO>> getCryptoOhlcv(
//            @PathVariable String coinGeckoId,
//            @RequestParam(defaultValue = "1M") String timeframe
//    ) {
//        CryptoDetailedDTO cryptoDetails = cryptoService.getCryptoWithMarketData(coinGeckoId);
//        List<CryptoOhlcvmDTO> ohlcvData = switch (timeframe.toUpperCase()) {
//            case "1H", "1D", "1W" -> cryptoDetails.ohlcvmWeek;
//            case "1M" -> cryptoDetails.ohlcvmMonth;
//            case "3M" -> cryptoDetails.ohlcvmHalfYear;
//            case "1Y" -> cryptoDetails.ohlcvmYear;
//            default -> cryptoDetails.ohlcvmMonth;
//        };
//        return ResponseEntity.ok(ohlcvData);
//    }
//}