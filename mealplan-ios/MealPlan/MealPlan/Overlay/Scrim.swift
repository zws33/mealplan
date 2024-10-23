//
//  Scrim.swift
//  MealPlan
//
//  Created by Zach Smith on 10/23/24.
//


import SwiftUI

struct Scrim<Content: View> : View {
    let content: Content

    init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }
    var body: some View {
        ZStack {
            Color.black
                .opacity(0.4)
                .ignoresSafeArea()
            content
        }
    }
}