//
//  MealPlanApp.swift
//  MealPlan
//
//  Created by Zach Smith on 10/15/24.
//

import SwiftUI

@main
struct MealPlanApp: App {
    @StateObject private var repository = Repository()
    var body: some Scene {
        WindowGroup {
            MainView().environmentObject(repository)
        }
    }
}

struct MainView : View {
    @EnvironmentObject var repository: Repository
    var body: some View {
        TabView {
            RecipeList(viewModel: .init(repository: repository))
                .tabItem {
                    Label("Recipes", systemImage: "list.bullet.rectangle")
                }
            RecipeForm(viewModel: .init(repository: repository))
                .tabItem {
                    Label("Add Recipe", systemImage: "plus.circle.fill")
                }
                .navigationTitle("Add Recipe")
        }
    }
}


struct MainView_Previews: PreviewProvider {
    static var repository = Repository()
    static var previews: some View {
        MainView()
            .environmentObject(repository)
    }
}
