package com.example.backendspring.services.predictors;

import java.util.List;

public class LstmResult {
    private List<Double> predictions;
    private Double confidence;

    public LstmResult() {}

    public LstmResult(List<Double> predictions, Double confidence) {
        this.predictions = predictions;
        this.confidence = confidence;
    }

    public List<Double> getPredictions() { return predictions; }
    public void setPredictions(List<Double> predictions) { this.predictions = predictions; }
    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }
}

