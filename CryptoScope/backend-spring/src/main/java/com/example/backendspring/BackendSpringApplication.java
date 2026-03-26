package com.example.backendspring;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class BackendSpringApplication {

    public static void main(String[] args) {

        Dotenv dotenv = Dotenv.configure()
            .ignoreIfMissing()
            .load();                    
        // Dotenv dotenv = Dotenv.load();
        // System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
        // System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
        SpringApplication.run(BackendSpringApplication.class, args);
    }
}
