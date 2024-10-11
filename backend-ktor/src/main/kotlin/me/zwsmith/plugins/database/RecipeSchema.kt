package me.zwsmith.plugins.database

import me.zwsmith.plugins.Ingredient
import me.zwsmith.plugins.QuantifiedIngredient
import me.zwsmith.plugins.Recipe
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable


object Recipes : IntIdTable() {
    val name = varchar("name", 255)
    val description = text("description")
}

object Ingredients : IntIdTable() {
    val name = varchar("name", 255)
}

object QuantifiedIngredients : IntIdTable() {
    val recipeId = reference("recipe_id", Recipes)
    val ingredientId = reference("ingredient_id", Ingredients)
    val amount = float("amount")
    val unit = varchar("unit", 50)
}

class RecipeDao(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<RecipeDao>(Recipes)
    
    var name by Recipes.name
    var description by Recipes.description
    val quantifiedIngredients by QuantifiedIngredientDao referrersOn QuantifiedIngredients.recipeId
}

class IngredientDao(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<IngredientDao>(Ingredients)
    
    var name by Ingredients.name
}

class QuantifiedIngredientDao(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<QuantifiedIngredientDao>(QuantifiedIngredients)
    
    var amount by QuantifiedIngredients.amount
    var unit by QuantifiedIngredients.unit
    var recipe by RecipeDao referencedOn QuantifiedIngredients.recipeId
    var ingredient by IngredientDao referencedOn QuantifiedIngredients.ingredientId
}

fun RecipeDao.toRecipe(): Recipe {
    return Recipe(
        id = this.id.value,
        name = this.name,
        description = this.description,
        quantifiedIngredients = this.quantifiedIngredients.map { it.toQuantifiedIngredient() }
    )
}

fun IngredientDao.toIngredient(): Ingredient {
    return Ingredient(
        id = this.id.value,
        name = this.name,
    )
}

fun QuantifiedIngredientDao.toQuantifiedIngredient(): QuantifiedIngredient {
    return QuantifiedIngredient(
        ingredient = this.ingredient.toIngredient(),
        amount = this.amount,
        unit = this.unit,
    )
}
