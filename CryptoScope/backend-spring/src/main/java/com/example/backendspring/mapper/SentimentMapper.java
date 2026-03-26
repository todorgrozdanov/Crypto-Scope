package com.example.backendspring.mapper;


import com.example.backendspring.dto.SentimentDTO;

import com.example.backendspring.entities.Sentiment;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SentimentMapper {
    SentimentDTO toDto(Sentiment sentiment);
    List<SentimentDTO> toDto(List<Sentiment> sentiment);

    @InheritInverseConfiguration
    Sentiment toEntity(SentimentDTO sentimentDto);
    @InheritInverseConfiguration
    List<Sentiment> toEntity(List<SentimentDTO> sentimentDtos);
}
