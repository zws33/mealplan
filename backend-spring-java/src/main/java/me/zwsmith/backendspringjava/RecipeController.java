package me.zwsmith.backendspringjava;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RecipeController {

    private final RecipeRepository recipeRepository;

    public RecipeController(RecipeRepository recipeRepository) {
        this.recipeRepository = recipeRepository;
    }

    @GetMapping("/recipes")
    public Iterable<Recipe> findAllRecipes() {
        return this.recipeRepository.findAll();
    }

    @PostMapping("/recipes")
    public Recipe addOneRecipes(@RequestBody Recipe employee) {
        return this.recipeRepository.save(employee);
    }
}