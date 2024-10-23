//
//  SuccessOverlay.swift
//  MealPlan
//
//  Created by Zach Smith on 10/23/24.
//


import SwiftUI

struct SuccessOverlay: View {
    let message: String
    let dismissAction: () -> Void
    
    var body: some View {
        Scrim {
            VStack(alignment: .center, spacing: 16) {
                Image(systemName: "checkmark.circle.fill")
                    .font(.system(size: 40))
                    .foregroundColor(.green)
                    .padding(.top)
                Text(message)
                    .font(.headline)
                    .multilineTextAlignment(.center)
                Divider()
                Button(action: dismissAction) {
                    Text("OK")
                        .font(.headline)
                }
                .padding(.horizontal)
                .padding(.bottom)
            }
            .background(Color(uiColor: .systemBackground))
            .cornerRadius(12)
            .shadow(radius: 8)
            .padding(.horizontal, 40)
        }
    }
}

#Preview {
    SuccessOverlay(message: "Recipe created!", dismissAction: {})
}
