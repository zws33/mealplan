//
//  ViewModel.swift
//  MealPlan
//
//  Created by Zach Smith on 10/22/24.
//
import Foundation

extension RecipeForm {
    @MainActor
    class ViewModel: ObservableObject {
        let repository: Repository
        @Published var recipeName: String = ""
        @Published var recipeDescription: String = ""
        @Published var quantifiedIngredients = [QuantifiedIngredient]()
        @Published var status: RecipeCreationStatus? = nil
        @Published var showAlert = false
        
        init(repository: Repository) {
            self.repository = repository
        }
        
        func createRecipe() {
            let quantifiedIngredientData = quantifiedIngredients.map { ingredient in
                QuantifiedIngredientData(amount: ingredient.amount, unit: ingredient.unit, ingredient: IngredientData(name: ingredient.name))
            }
            Task {
                showAlert = true
                status = .loading
                let result = await repository.addRecipe(name: recipeName, description: recipeDescription, ingredients: quantifiedIngredientData)
                switch result {
                case .success(_):
                    recipeName = ""
                    recipeDescription = ""
                    quantifiedIngredients = []
                    status = .success
                case.failure(let error):
                    status = .error(error.localizedDescription)
                }
            }
        }
        
        func addIngredient(name: String, amount: Double, unit: String){
            let ingredient = QuantifiedIngredient(
                amount: amount,
                unit: unit,
                name:name)
            quantifiedIngredients.append(ingredient)
        }
        
        func deleteIngredients(asOffsets offsets: IndexSet) {
            quantifiedIngredients.remove(atOffsets: offsets)
        }
        
        func dismissOverlay() {
            status = nil
        }
    }
    
    enum RecipeCreationStatus {
        case loading
        case error(String)
        case success
    }
    
    struct QuantifiedIngredient: Identifiable {
        let id = UUID()
        let amount: Double
        let unit: String
        let name: String
    }
}
