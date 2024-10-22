//
//  getRecipes.swift
//  MealPlan
//
//  Created by Zach Smith on 10/18/24.
//

import Foundation
struct RecipesApi {
    private let baseUrl = "http://192.168.1.167:8080/"
    func getRecipes() async -> Result<[Recipe], Error> {
        guard let url = URL(string: baseUrl+"recipes") else {
            return .failure(NSError(domain: "", code: -1, userInfo: [NSLocalizedDescriptionKey: "Invalid URL"]))
        }
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        do {
            let (data, _) = try await URLSession.shared.data(for: request)
            // Decode the JSON data
            guard let recipes = try? JSONDecoder().decode([Recipe].self, from: data) else {
                return .failure(NSError(domain: "", code: -1, userInfo: [NSLocalizedDescriptionKey: "Failed to decode recipes"]))
            }
            
            // Success case
            return .success(recipes)
            
        } catch {
            // If any error occurs, return it as failure
            return .failure(error)
        }
    }
    
    func addRecipe(_ name: String,_ description: String?,_ quantifiedIngredients: [QuantifiedIngredientData]) async -> Result<Recipe, Error> {
        let recipeData = RecipeData(name: name, description: description, ingredients: quantifiedIngredients)
        guard let url = URL(string: baseUrl+"recipes") else {
            return .failure(NSError(domain: "", code: -1, userInfo: [NSLocalizedDescriptionKey: "Invalid URL"]))
        }
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        do {
            let recipeJson = try JSONEncoder().encode(recipeData)
            request.httpBody = recipeJson
            
            let (data, _) = try await URLSession.shared.data(for: request)
            guard let newRecipe = try? JSONDecoder().decode(Recipe.self, from: data) else {
                let error = NSError(domain: "", code: -1, userInfo: [NSLocalizedDescriptionKey: "Failed to decode new recipe"])
                return .failure(error)
            }

            return .success(newRecipe)
            
        } catch {
            print ("Error: \(error)")
            return .failure(error)
        }
    }
}

struct RecipeData : Codable{
    let name: String
    let description: String?
    let ingredients: [QuantifiedIngredientData]
}

struct QuantifiedIngredientData: Codable {
    let amount: Double
    let unit: String
    let ingredient: IngredientData
}

struct IngredientData: Codable {
    let name: String
}


struct Ingredient: Codable, Identifiable, Hashable {
    let id: Int
    let name: String
}

// Define the structure for a QuantifiedIngredient
struct QuantifiedIngredient: Codable, Hashable {
    let ingredient: Ingredient
    let amount: Double
    let unit: String
}

// Define the structure for a Recipe
struct Recipe: Codable, Identifiable, Hashable {
    let id: Int
    let name: String
    let description: String
    let quantifiedIngredients: [QuantifiedIngredient]
}

