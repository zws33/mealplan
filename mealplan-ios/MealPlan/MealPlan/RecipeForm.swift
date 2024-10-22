//
//  RecipeForm.swift
//  MealPlan
//
//  Created by Zach Smith on 10/18/24.
//

import SwiftUI

struct RecipeForm: View {
    @EnvironmentObject var repository: Repository
    @StateObject var recipeData = RecipeData()
    
    var body: some View {
        NavigationStack {
            Form {
                Section(header: Text("Recipe Information")) {
                    TextField("Recipe Name", text: $recipeData.name)
                    TextField("Description", text: $recipeData.description)
                }
        
                Section(header: Text("Ingredients")) {
                    NavigationLink {
                        IngredientInput(addIngredient: self.addIngredient)
                    } label: {
                        Text("Edit Ingredients")
                    }
                    List {
                        ForEach($recipeData.ingredients) { $ingredient in
                            Text("\(ingredient.amount, specifier: "%.2f") \(ingredient.unit) \(ingredient.name)")
                        }
                        .onDelete(perform: removeIngredient)
                    }
                }
            }.toolbar {
                Button("Save") {
                    _ = saveRecipe()
                }
            }
        }
    }
    private func removeIngredient(offset: IndexSet) {
        recipeData.ingredients.remove(atOffsets: offset)
    }
    private func addIngredient(name: String, amount: Double, unit: String) {
        let ingredient = Ingredient(amount: amount, unit: unit, name: name)
        recipeData.ingredients.append(ingredient)
    }
    private func saveRecipe() -> Task<(), Never> {
        return Task {
            await repository.addRecipe(
                name: recipeData.name,
                description: recipeData.description,
                ingredients: recipeData.ingredients.map {
                    QuantifiedIngredientData(
                        amount: $0.amount,
                        unit: $0.unit,
                        ingredient: IngredientData(name:$0.name))
                }
            )
        }
    }
}

extension RecipeForm {
    class RecipeData: ObservableObject {
        @Published var name: String = ""
        @Published var description: String = ""
        @Published var ingredients: [Ingredient] = []
    }

    struct Ingredient: Identifiable {
        var id: UUID = UUID()
        var amount: Double = 0
        var unit: String = ""
        var name: String = ""
    }
}

extension RecipeForm {
    struct IngredientInput: View {
        @Environment(\.dismiss) var dismiss
        @State var name: String = ""
        @State var amount: Double? = nil
        @State var unit: String = ""
        let addIngredient: (String, Double, String) -> Void
        let formatter: NumberFormatter = {
            let formatter = NumberFormatter()
            formatter.numberStyle = .decimal
            formatter.maximumFractionDigits = 2
            return formatter
        }()
        var body: some View {
            List {
                VStack {
                    TextField("Ingredient Name", text: $name)
                    HStack {
                        TextField("Amount",
                                  value: $amount,
                                  format: .number)
                        TextField("Unit", text: $unit)
                    }
                    Button("Add Ingredient") {
                        if let amount = amount {
                            if (!name.isEmpty && !unit.isEmpty) {
                                addIngredient(name, amount, unit)
                                self.dismiss()
                            }
                        }
                    }
                }
            }
        }
    }
}


#Preview {
    RecipeForm()
}
