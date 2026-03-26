package com.example.backendspring.services.predictors;

public interface Predictor<T> {
    T predict(Long cryptoId, Integer days);
    String getName();
}
