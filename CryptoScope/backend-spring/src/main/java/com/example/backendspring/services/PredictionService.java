package com.example.backendspring.services;

import com.example.backendspring.dto.PricePredictionDTO;

import com.example.backendspring.entities.PricePrediction;
import com.example.backendspring.services.predictors.LstmResult;
import com.example.backendspring.services.predictors.Predictor;
import com.example.backendspring.repositories.PricePredictionRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service class responsible for handling price prediction logic.
 * It communicates with external prediction services (LSTM, XGB),
 * stores prediction results in the database and exposes them
 * in a DTO format to the controller layer.
 */

@Service
@RequiredArgsConstructor
public class PredictionService {
    private final PricePredictionRepository predictionRepository;
    private final RestTemplate restTemplate;
    private final Map<String, Predictor<?>> predictors;

    private Long fetchCryptoId(String coinGeckoId) {
        return restTemplate.getForObject(
                "https://das-backend-8081.azurewebsites.net/api/crypto/" + coinGeckoId + "/id",
                Long.class
        );
    }

    private PricePredictionDTO toDTO(PricePrediction pred) {
        PricePredictionDTO dto = new PricePredictionDTO();
        dto.setPredictedDate(pred.getPredictedDate());
        dto.setPredictedClose(pred.getPredictedClose());
        dto.setConfidence(pred.getConfidence());
        return dto;
    }

    public List<PricePredictionDTO> getPredictions(Long cryptoId) {
        return predictionRepository.findByCryptoIdOrderByPredictedDateAsc(cryptoId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    private void savePredictions(Long cryptoId, List<Double> predictions, Double confidence) {
        predictionRepository.deleteByCryptoId(cryptoId);
        LocalDate startDate = LocalDate.now().plusDays(1);
        for (int i = 0; i < predictions.size(); i++) {
            PricePrediction pred = new PricePrediction();
            pred.setCryptoId(cryptoId);
            pred.setPredictedDate(startDate.plusDays(i));
            pred.setPredictedClose(BigDecimal.valueOf(predictions.get(i)));
            pred.setConfidence(BigDecimal.valueOf(confidence));
            predictionRepository.save(pred);
        }
    }

    @SuppressWarnings("unchecked")
    public List<PricePredictionDTO> lstmPredict(String coinGeckoId, int days) {
        Long cryptoId = fetchCryptoId(coinGeckoId);
        Predictor<LstmResult> p = (Predictor<LstmResult>) predictors.get("lstm");
        LstmResult result = p.predict(cryptoId, days);
        if (result == null || result.getPredictions() == null || result.getPredictions().isEmpty()) {
            return List.of();
        }
        savePredictions(cryptoId, result.getPredictions(), result.getConfidence());
        return getPredictions(cryptoId);
    }

    @SuppressWarnings("unchecked")
    public String xgbPredict(String coinGeckoId) {
        Long cryptoId = fetchCryptoId(coinGeckoId);
        Predictor<Integer> p = (Predictor<Integer>) predictors.get("xgb");
        int prediction = p.predict(cryptoId, null);
        return prediction == 0 ? "negative" : prediction == 1 ? "neutral" : "positive";
    }
}

