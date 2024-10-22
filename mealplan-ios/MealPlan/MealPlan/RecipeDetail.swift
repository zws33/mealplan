//
//  RecipeDetail.swift
//  MealPlan
//
//  Created by Zach Smith on 10/22/24.
//

import SwiftUI

struct RecipeDetail: View {
    let recipe: Recipe
    var body: some View {
        List {
            Section(header: Text("Recipe Info")) {
                Text(recipe.name)
                Text(recipe.description)
            }
            Section(header: Text("Ingredients")) {
                ForEach(recipe.quantifiedIngredients, id: \.ingredient.id) { ingredient in
                    Text("\(ingredient.amount, specifier: "%.2f") \(ingredient.unit) \(ingredient.ingredient.name)")
                }
            }
        }
    }
}

#Preview {
    
    RecipeDetail(recipe: Repository.defaultRecipes[0])
}
