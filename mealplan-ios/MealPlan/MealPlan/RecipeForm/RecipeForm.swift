//
//  RecipeForm.swift
//  MealPlan
//
//  Created by Zach Smith on 10/18/24.
//

import SwiftUI

struct RecipeForm: View {

    @StateObject var viewModel: ViewModel
    
    var body: some View {
        NavigationStack {
            ZStack {
                Form {
                    Section(header: Text("Recipe Information")) {
                        TextField("Recipe Name", text: $viewModel.recipeName)
                        TextField("Description", text: $viewModel.recipeDescription)
                    }
                    
                    Section(header: Text("Ingredients")) {
                        NavigationLink {
                            IngredientInput(addIngredient: self.addIngredient)
                        } label: {
                            Text("Add Ingredients")
                                .font(.subheadline)
                        }
                        List {
                            ForEach($viewModel.quantifiedIngredients) { $ingredient in
                                Text("\(ingredient.amount, specifier: "%.2f") \(ingredient.unit) \(ingredient.name)")
                            }
                            .onDelete(perform: removeIngredient)
                        }
                    }
  
                }.toolbar {
                    Button("Save") {
                        createRecipe()
                    }
                }
                if(viewModel.status != nil) {
                    switch viewModel.status {
                    case .loading:
                        LoadingOverlay(message: "Loading...")
                    case .error(let message):
                        ErrorOverlay(message: message, dismissAction: viewModel.dismissOverlay)
                    case .success:
                        SuccessOverlay(message: "Recipe created!", dismissAction: viewModel.dismissOverlay)
                    default:
                        EmptyView()
                    }
                }
            }
        }
    }
    private func removeIngredient(offsets: IndexSet) {
        viewModel.deleteIngredients(asOffsets: offsets)
    }
    private func addIngredient(name: String, amount: Double, unit: String) {
        viewModel.addIngredient(name: name, amount: amount, unit: unit)
    }
    private func createRecipe() -> Void {
        viewModel.createRecipe()
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
    RecipeForm(viewModel: .init(repository: Repository()))
}
