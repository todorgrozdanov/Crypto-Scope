//package com.example.backendspring.mapper;
//
//import com.example.backendspring.dto.CryptoOhlcvmDTO;
//import com.example.backendspring.entities.Price;
//import org.mapstruct.InheritInverseConfiguration;
//import org.mapstruct.Mapper;
//
//import java.util.List;
//
//@Mapper(componentModel = "spring")
//public interface CryptoOhlcvMapper {
//
//    CryptoOhlcvmDTO toDto(Price ohlcv);
//    List<CryptoOhlcvmDTO> toDto(List<Price> ohlcv);
//
//    @InheritInverseConfiguration
//    Price toEntity(CryptoOhlcvmDTO ohlcvDto);
//    @InheritInverseConfiguration
//    List<Price> toEntity(List<CryptoOhlcvmDTO> ohlcvDtos);
//}
