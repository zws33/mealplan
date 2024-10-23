//
//  LoadingOverlay.swift
//  MealPlan
//
//  Created by Zach Smith on 10/23/24.
//


import SwiftUI

struct LoadingOverlay: View {
    let message: String
    
    var body: some View {
        Scrim{

            VStack(alignment: .center) {
                ProgressView()
                    .scaleEffect(2)
                    .padding()
                Text(message)
                    .font(.headline)
                    .padding()
            }
            .padding()
            .frame(maxWidth: .infinity)
            .background(Color(uiColor: .systemBackground))
            .cornerRadius(12)
            .shadow(radius: 8)
            .padding(.horizontal, 40)
        }
    }
}

#Preview {
    LoadingOverlay(message: "Loading...")
}
