package me.zwsmith.backendspringjava;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.beans.factory.annotation.Autowired;

@SpringBootApplication
public class BackendSpringJavaApplication {

    private final RecipeRepository recipesRepository;

    public BackendSpringJavaApplication(RecipeRepository recipesRepository) {
        this.recipesRepository = recipesRepository;
    }

    public static void main(String[] args) {
        SpringApplication.run(BackendSpringJavaApplication.class, args);
    }

    // test connecting to database
    @Bean
    public CommandLineRunner testConnection(){
      return args -> {
          // find recipes
          recipesRepository.findById(12l).ifPresent((System.out::println));
      };
    }
}