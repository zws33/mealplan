//
//  RecipeListViewModel.swift
//  MealPlan
//
//  Created by Zach Smith on 10/22/24.
//

import Foundation

extension RecipeList {
    @MainActor
    class ViewModel: ObservableObject {
        @Published var isLoading = false
        @Published var error: String? = nil
        @Published var recipes: [Recipe] = []
        private let repository: Repository
        
        init(repository: Repository) {
            self.repository = repository
        }
        
        func deleteRecipes(atOffsets offsets: IndexSet){
            recipes.remove(atOffsets: offsets)
        }
        
        func refreshRecipes() {
            Task {
                isLoading = true
                let result = await repository.refreshRecipes()
                switch result {
                case .success(let newRecipes):
                    self.recipes = newRecipes
                case .failure(let newError):
                    self.error = newError.localizedDescription
                }
                isLoading = false
            }
            
        }
    }
}

