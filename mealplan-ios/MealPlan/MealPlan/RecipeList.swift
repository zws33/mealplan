//
//  ContentView.swift
//  MealPlan
//
//  Created by Zach Smith on 10/15/24.
//

import SwiftUI

struct RecipeList: View {
    @EnvironmentObject private var repository: Repository
    var body: some View {
        NavigationStack {
            List {
                ForEach(repository.recipes) { recipe in
                    NavigationLink {
                        RecipeDetail(recipe:recipe)
                    } label: {
                        RecipeRow(recipe: recipe)
                    }
                }
            }
            .navigationTitle("Recipes")
        }.onAppear {
            Task {
                await repository.refreshRecipes()
            }
        }
    }
}

struct RecipeRow : View {
    let recipe: Recipe
    var body: some View {
        VStack(alignment: .leading) {
            Text(recipe.name)
                .font(.headline)
            
            Text(recipe.description)
                .font(.subheadline)
        }
        .padding()
        .clipShape(RoundedRectangle(cornerRadius: 20))
        
    }
}

#Preview {
    let repository = Repository(recipes: Repository.defaultRecipes)
    RecipeList().environmentObject(_: repository)
}
