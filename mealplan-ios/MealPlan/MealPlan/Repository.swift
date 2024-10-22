//
//  RecipesRepository.swift
//  MealPlan
//
//  Created by Zach Smith on 10/15/24.
//

import Foundation

class Repository: ObservableObject {
    @Published var recipes = [Recipe]()
    @Published var error: String? = nil
    var isError: Bool = false
    
    init(recipes: [Recipe] = defaultRecipes) {
        self.recipes = recipes
    }
    
    func refreshRecipes() async {
        let result = await RecipesApi().getRecipes()
        DispatchQueue.main.async {
            switch result {
            case .success(let newRecipes):
                self.recipes = newRecipes
            case .failure(let error):
                print(error)
            }
        }
    }
    
    func addRecipe(
        name: String,
        description: String,
        ingredients: [QuantifiedIngredientData]
    ) async {
        let result = await RecipesApi().addRecipe(
            name,
            description,
            ingredients)
        DispatchQueue.main.async {
            switch result {
            case .success(let newRecipe):
                self.recipes.append(newRecipe)
            case .failure(let error):
                self.error = error.localizedDescription
                print(error)
            }
        }
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

