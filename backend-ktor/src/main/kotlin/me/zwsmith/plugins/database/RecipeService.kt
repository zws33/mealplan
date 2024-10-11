package me.zwsmith.plugins.database

import kotlinx.coroutines.Dispatchers
import me.zwsmith.plugins.Ingredient
import me.zwsmith.plugins.QuantifiedIngredient
import me.zwsmith.plugins.Recipe
import me.zwsmith.plugins.recipes.QuantifiedIngredientInput
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.jetbrains.exposed.sql.transactions.transaction

class RecipeService(database: Database) {
    init {
        transaction(database) {
            SchemaUtils.create(Recipes, Ingredients, QuantifiedIngredients)
        }
    }
    
    suspend fun createIngredient(name: String): Ingredient = dbQuery {
        IngredientDao.new {
            this.name = name
        }.toIngredient()
    }
    
    suspend fun findIngredientById(id: Int) = dbQuery {
        IngredientDao.findById(id)?.toIngredient()
    }
    
    suspend fun updateIngredient(updateData: Ingredient) = dbQuery {
        IngredientDao.findById(updateData.id)?.apply {
            name = updateData.name
        }?.toIngredient()
    }
    
    suspend fun deleteIngredient(id: Int) = dbQuery {
        val ingredient = IngredientDao.findById(id)
        if(ingredient == null) {
            throw IllegalArgumentException("No Ingredient found with ID $id")
        } else {
            ingredient.delete()
        }
    }
    
    suspend fun createRecipe(
        name: String,
        description: String,
        ingredientInputs: List<QuantifiedIngredientInput>
    ): Recipe {
        return dbQuery {
            val recipe = RecipeDao.new {
                this.name = name
                this.description = description
            }
            
            // Associate QuantifiedIngredients with the new Recipe
            ingredientInputs.forEach { input ->
                val ingredient = IngredientDao
                    .find { Ingredients.name eq input.ingredient.name }
                    .singleOrNull()
                    ?: IngredientDao.new {
                        this.name = input.ingredient.name
                    }
                QuantifiedIngredientDao.new {
                    this.amount = input.amount
                    this.unit = input.unit
                    this.recipe = recipe
                    this.ingredient = ingredient
                }
            }
            
            recipe.toRecipe()
        }
    }
    
    suspend fun findRecipeById(id: Int): Recipe = dbQuery {
        RecipeDao.findById(id)
            ?.toRecipe()
            ?: throw IllegalArgumentException("Recipe with id $id does not exist")
    }
    
    suspend fun findRecipes(): List<Recipe> = dbQuery {
        RecipeDao.all().map { it.toRecipe() }
    }
    
    suspend fun updateRecipe(
        recipeId: Int,
        name: String? = null,
        description: String? = null,
        ingredients: List<QuantifiedIngredient>? = null
    ): Recipe = dbQuery {
        var recipe = RecipeDao.findById(recipeId)
            ?: throw IllegalArgumentException("Recipe with id $recipeId not found")
        if (name != null) {
            recipe.name = name
        }
        if (description != null) {
            recipe.description = description
        }
        if(ingredients != null) {
            updateRecipeIngredients(recipeId, ingredients)
        }
        recipe.toRecipe()
    }
    
    suspend fun updateRecipeIngredients(recipeId: Int, ingredients: List<QuantifiedIngredient>) = dbQuery {
        var recipe = RecipeDao.findById(recipeId)
            ?: throw IllegalArgumentException("Recipe with id $recipeId not found")
        recipe.quantifiedIngredients.forEach {
            it.delete()
        }
        ingredients.forEach { qi ->
            QuantifiedIngredientDao.new {
                amount = qi.amount
                unit = qi.unit
                this.recipe = recipe
                ingredient = IngredientDao[qi.ingredient.id]
            }
        }
        recipe.toRecipe()
    }
    
    suspend fun deleteRecipe(id: Int): Boolean = dbQuery {
        val recipe = RecipeDao.findById(id)
        if (recipe != null) {
            recipe.delete()
            true
        } else {
            false
        }
    }
    
    private suspend fun <T> dbQuery(block: suspend () -> T): T =
        newSuspendedTransaction(Dispatchers.IO) { block() }
}