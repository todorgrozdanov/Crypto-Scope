package com.example.backendspring.services.predictors;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component("xgb")
@RequiredArgsConstructor
public class XgbPredictor implements Predictor<Integer> {
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Override
    public Integer predict(Long cryptoId, Integer days) {
        String url = "https://das-flask-5001.azurewebsites.net/xgb/predict/" + cryptoId;
        try {
            String body = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(body);
            return root.get("prediction").asInt();
        } catch (Exception e) {
            throw new RuntimeException("XGB call failed", e);
        }
    }

    @Override
    public String getName() { return "xgb"; }
}
