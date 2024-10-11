package me.zwsmith.plugins.recipes

import kotlinx.serialization.Serializable
import me.zwsmith.plugins.QuantifiedIngredient

@Serializable
data class RecipeInput(
    val name: String,
    val description: String,
    val ingredients: List<QuantifiedIngredientInput>,
)
@Serializable
data class QuantifiedIngredientInput(
    val ingredient: IngredientInput,
    val amount: Float,
    val unit: String
)

@Serializable
data class IngredientInput(
    val name: String
)

@Serializable
data class RecipeUpdate(
    val name: String,
    val description: String,
    val ingredients: List<QuantifiedIngredient>
)

@Serializable
data class ShoppingListRequest(
    val recipeIds: List<Int>
)