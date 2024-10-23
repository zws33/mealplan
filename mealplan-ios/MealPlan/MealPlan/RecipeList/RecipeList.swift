//
//  ContentView.swift
//  MealPlan
//
//  Created by Zach Smith on 10/15/24.
//

import SwiftUI

struct RecipeList: View {
    @StateObject var viewModel: ViewModel
    
    var body: some View {
        NavigationStack {
            Group {
                if(viewModel.isLoading) {
                    ProgressView("Loading…")
                } else {
                    List {
                        ForEach(viewModel.recipes) { recipe in
                            NavigationLink {
                                RecipeDetail(recipe:recipe)
                            } label: {
                                RecipeRow(recipe: recipe)
                            }
                        }.onDelete(perform: viewModel.deleteRecipes)
                    }
                    .toolbar {
                        EditButton()
                    }
                }
            }
            .navigationTitle("Recipes")
        }
        .onAppear {
            viewModel.refreshRecipes()
        }.alert(isPresented: Binding(
            get: { viewModel.error != nil },
            set: { if !$0 {viewModel.error = nil } }
        )) {
            Alert(title: Text("Error"), message: Text(viewModel.error ?? ""), dismissButton: .default(Text("OK")))
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
    let repository = Repository()
    RecipeList(viewModel: .init(repository: repository))
}
