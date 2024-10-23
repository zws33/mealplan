//
//  RecipesRepository.swift
//  MealPlan
//
//  Created by Zach Smith on 10/15/24.
//

import Foundation

class Repository: ObservableObject {
    let recipeApi: RecipesApi = RecipesApi()
    
    func refreshRecipes() async -> Result<[Recipe], Error>{
        return await recipeApi.getRecipes()
    }
    
    func addRecipe(
        name: String,
        description: String,
        ingredients: [QuantifiedIngredientData]
    ) async -> Result<Recipe, Error> {
        let recipeData = RecipeData(name: name, description: description, ingredients: ingredients)
        return await recipeApi.addRecipe(recipeData)
    }
    
    static let defaultRecipes: [Recipe] = [
        Recipe(
            id: 1,
            name: "Chicken and Rice",
            description: "A simple and delicious meal.",
            quantifiedIngredients: [
                QuantifiedIngredient(
                    ingredient: Ingredient(id: 1, name: "Chicken"),
                    amount: 1,
                    unit: "pound"),
                QuantifiedIngredient(
                    ingredient: Ingredient(id: 2, name: "Rice"),
                    amount: 1,
                    unit: "cup")
            ]
        )
    ]
}

