package me.zwsmith.plugins.database

import kotlinx.coroutines.Dispatchers
import kotlinx.serialization.Serializable
import me.zwsmith.plugins.Ingredient
import me.zwsmith.plugins.QuantifiedIngredient
import me.zwsmith.plugins.Recipe
import org.jetbrains.exposed.dao.id.CompositeID
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.Transaction
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.jetbrains.exposed.sql.transactions.transaction
import org.slf4j.LoggerFactory

class RecipeService(database: Database) {
    val logger = LoggerFactory.getLogger(RecipeService::class.java)
    
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
    
    suspend fun findIngredientById(id: Int): Ingredient? = dbQuery {
        IngredientDao.findById(id)?.toIngredient()
    }
    
    suspend fun updateIngredient(updateData: Ingredient): Ingredient? = dbQuery {
        IngredientDao.findById(updateData.id)?.apply {
            name = updateData.name
        }?.toIngredient()
    }
    
    suspend fun deleteIngredient(id: Int) = dbQuery {
        val ingredient = IngredientDao.findById(id)
        if (ingredient == null) {
            false
        } else {
            ingredient.delete()
            true
        }
    }
    
    suspend fun createRecipe(
        name: String,
        description: String?,
        ingredientInputs: List<QuantifiedIngredientInput>
    ): Recipe {
        return dbQuery {
            logger.debug("Creating recipe: $name")
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
    
    suspend fun findRecipeById(id: Int): Recipe? = dbQuery {
        RecipeDao.findById(id)?.toRecipe()
    }
    
    suspend fun findRecipes(): List<Recipe> = dbQuery {
        RecipeDao.all().map { it.toRecipe() }
    }
    
    suspend fun updateRecipe(
        recipeId: Int,
        recipeUpdate: RecipeUpdate
    ): Recipe? = dbQuery {
        RecipeDao.findById(recipeId)?.apply {
            val (name, description, ingredients) = recipeUpdate
            if (name != null) {
                this.name = name
            }
            if (description != null) {
                this.description = description
            }
            if (ingredients != null) {
                updateRecipeIngredients(recipeId, ingredients)
            }
        }?.toRecipe()
    }
    
    suspend fun updateRecipeIngredients(
        recipeId: Int,
        ingredients: List<QuantifiedIngredient>
    ) = dbQuery {
        ingredients.forEach { qi ->
            val id = CompositeID {
                it[QuantifiedIngredients.recipeId] = recipeId
                it[QuantifiedIngredients.ingredientId] = qi.ingredient.id
            }
            val dao = QuantifiedIngredientDao.findById(id)
            if (dao != null) {
                dao.apply {
                    amount = qi.amount
                    unit = qi.unit
                }
            } else {
                val recipeDao = RecipeDao.findById(recipeId)
                    ?: throw IllegalArgumentException("Recipe update failed: Could not find recipe with id: $recipeId")
                val ingredientDao = IngredientDao.findById(qi.ingredient.id)
                    ?: throw IllegalArgumentException("Recipe update failed: Could not find ingredient with id: ${qi.ingredient.id}")
                QuantifiedIngredientDao.new {
                    amount = qi.amount
                    unit = qi.unit
                    this.recipe = recipeDao
                    this.ingredient = ingredientDao
                }
            }
        }
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
    
    private suspend fun <T> dbQuery(block: suspend Transaction.() -> T): T =
        newSuspendedTransaction(Dispatchers.IO) { block() }
    
    companion object {
        fun create(database: Database) = RecipeService(database)
    }
}

@Serializable
data class RecipeInput(
    val name: String,
    val description: String?,
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
    val name: String?,
    val description: String?,
    val ingredients: List<QuantifiedIngredient>?
)

@Serializable
data class ShoppingListRequest(
    val recipeIds: List<Int>
)