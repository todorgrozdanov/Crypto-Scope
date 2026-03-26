package com.example.backendspring.controllers;

import com.example.backendspring.services.PredictionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller class that exposes REST endpoints for crypto price predictions.
 * It receives HTTP requests and delegates the prediction logic
 * to the PredictionService.
 */

@RestController
@RequestMapping("/api/prediction")
@CrossOrigin(origins = "https://dasclient.z1.web.core.windows.net")
@RequiredArgsConstructor
public class PredictionController {

    private final PredictionService predictionService;

    @GetMapping("/{coinGeckoId}/lstm/predict")
    public ResponseEntity<?> lstm(
            @PathVariable String coinGeckoId,
            @RequestParam(defaultValue = "7") int days
    ) {
        return ResponseEntity.ok(
                predictionService.lstmPredict(coinGeckoId, days)
        );
    }

    @GetMapping("/{coinGeckoId}/xgb/predict")
    public ResponseEntity<?> xgb(
            @PathVariable String coinGeckoId
    ) {
        return ResponseEntity.ok(
                predictionService.xgbPredict(coinGeckoId)
        );
    }
}

