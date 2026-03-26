package com.example.backendspring.services.predictors;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Component("lstm")
@RequiredArgsConstructor
public class LstmPredictor implements Predictor<LstmResult> {
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Override
    public LstmResult predict(Long cryptoId, Integer days) {
        String url = "https://das-flask-5001.azurewebsites.net/lstm/predict/" + cryptoId + "?days=" + days;
        try {
            String body = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(body);
            List<Double> predictions = objectMapper.convertValue(
                    root.get("predictions"),
                    new TypeReference<List<Double>>() {}
            );
            Double confidence = root.has("confidence") ? root.get("confidence").asDouble() : 0.0;
            return new LstmResult(predictions, confidence);
        } catch (Exception e) {
            throw new RuntimeException("LSTM call failed", e);
        }
    }

    @Override
    public String getName() { return "lstm"; }
}
