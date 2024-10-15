package me.zwsmith.plugins

import kotlinx.serialization.Serializable

@Serializable
data class Recipe(
    val id: Int,
    val name: String,
    val description: String?,
    val quantifiedIngredients: List<QuantifiedIngredient>
)
@Serializable
data class Ingredient(
    val id: Int,
    val name: String
)
@Serializable
data class QuantifiedIngredient(
    val ingredient: Ingredient,
    val amount: Float,
    val unit: String,
)