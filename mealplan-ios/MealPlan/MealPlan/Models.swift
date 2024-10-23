//
//  Ingredient.swift
//  MealPlan
//
//  Created by Zach Smith on 10/22/24.
//


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