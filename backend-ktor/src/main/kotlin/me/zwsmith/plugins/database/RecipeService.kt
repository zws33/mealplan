package me.zwsmith.plugins.database

import kotlinx.coroutines.Dispatchers
import kotlinx.serialization.Serializable
import me.zwsmith.plugins.Ingredient
import me.zwsmith.plugins.QuantifiedIngredient
import me.zwsmith.plugins.Recipe
import me.zwsmith.plugins.database.RecipeService.IngredientNotFoundError
import me.zwsmith.plugins.database.RecipeService.RecipeNotFoundError
import org.jetbrains.exposed.dao.id.CompositeID
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.Transaction
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.jetbrains.exposed.sql.transactions.transaction
import org.slf4j.Logger
import org.slf4j.LoggerFactory

interface RecipeService {
    suspend fun createIngredient(name: String): Result<Ingredient>
    suspend fun findIngredientById(id: Int): Result<Ingredient>
    suspend fun updateIngredient(updateData: Ingredient): Result<Ingredient>
    suspend fun deleteIngredient(id: Int): Result<Unit>
    suspend fun createRecipe(
        name: String,
        description: String?,
        ingredientInputs: List<QuantifiedIngredientInput>
    ): Result<Recipe>
    
    suspend fun findRecipeById(id: Int): Result<Recipe>
    suspend fun findRecipes(): Result<List<Recipe>>
    suspend fun updateRecipe(
        recipeId: Int,
        recipeUpdate: RecipeUpdate
    ): Result<Recipe>
    
    suspend fun updateRecipeIngredients(
        recipeId: Int,
        ingredients: List<QuantifiedIngredient>
    ): Result<Recipe>
    
    suspend fun deleteRecipe(id: Int): Result<Unit>
    
    class RecipeNotFoundError(id: Int) : IllegalArgumentException("Recipe not found for id: $id")
    class IngredientNotFoundError(id: Int) : IllegalArgumentException("Ingredient not found for id: $id")
}

class RecipeServiceImpl(database: Database, private val logger: Logger) : RecipeService {
    
    init {
        transaction(database) {
            SchemaUtils.create(Recipes, Ingredients, QuantifiedIngredients)
        }
    }
    
    override suspend fun createIngredient(name: String): Result<Ingredient> = dbQuery {
        runCatching {
            IngredientDao.new {
                this.name = name
            }.toIngredient()
        }
    }
    
    override suspend fun findIngredientById(id: Int): Result<Ingredient> = dbQuery {
        IngredientDao.findById(id)
            ?.toIngredient()
            ?.let { Result.success(it) }
            ?: Result.failure(IngredientNotFoundError(id))
    }
    
    override suspend fun updateIngredient(updateData: Ingredient): Result<Ingredient> = dbQuery {
        val ingredient = IngredientDao.findById(updateData.id)
        if (ingredient != null) {
            ingredient.name = updateData.name
            Result.success(ingredient.toIngredient())
        } else {
            Result.failure(IngredientNotFoundError(updateData.id))
        }
    }
    
    override suspend fun deleteIngredient(id: Int) = dbQuery {
        val ingredient = IngredientDao.findById(id)
        if (ingredient == null) {
            Result.failure(IngredientNotFoundError(id))
        } else {
            ingredient.delete()
            Result.success(Unit)
        }
    }
    
    override suspend fun createRecipe(
        name: String,
        description: String?,
        ingredientInputs: List<QuantifiedIngredientInput>
    ): Result<Recipe> = dbQuery {
        runCatching {
            val recipe = RecipeDao.new {
                this.name = name
                this.description = description
            }
            
            ingredientInputs.forEach { input ->
                val ingredient = IngredientDao
                    .find { Ingredients.name eq input.ingredient.name }
                    .singleOrNull()
                    ?: IngredientDao.new {
                        logger.info("Ingredient ${input.ingredient.name} not found. Creating new ingredient.")
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
    
    override suspend fun findRecipeById(id: Int): Result<Recipe> = dbQuery {
        val recipe = RecipeDao.findById(id)
        if (recipe == null) {
            Result.failure(RecipeNotFoundError(id))
        } else {
            Result.success(recipe.toRecipe())
        }
    }
    
    override suspend fun findRecipes(): Result<List<Recipe>> = dbQuery {
        runCatching { RecipeDao.all().map { it.toRecipe() } }
    }
    
    override suspend fun updateRecipe(
        recipeId: Int,
        recipeUpdate: RecipeUpdate
    ): Result<Recipe> {
        return dbQuery {
            val recipe = RecipeDao.findById(recipeId)
                ?: return@dbQuery Result.failure(RecipeNotFoundError(recipeId))
            recipe.apply {
                val (name, description, ingredients) = recipeUpdate
                if (name != null) {
                    this.name = name
                }
                if (description != null) {
                    this.description = description
                }
                if (ingredients != null) {
                    val ingredientsUpdate = updateRecipeIngredients(recipeId, ingredients)
                    if (ingredientsUpdate.isFailure) {
                        rollback()
                        return@dbQuery ingredientsUpdate
                    }
                }
            }
            Result.success(recipe.toRecipe())
        }
    }
    
    override suspend fun updateRecipeIngredients(
        recipeId: Int,
        ingredients: List<QuantifiedIngredient>
    ): Result<Recipe> = dbQuery {
        val recipeDao = RecipeDao.findById(recipeId)
        if (recipeDao == null) {
            rollback()
            return@dbQuery Result.failure(RecipeNotFoundError(recipeId))
        }
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
                val ingredientDao = IngredientDao.findById(qi.ingredient.id)
                if (ingredientDao == null) {
                    rollback()
                    return@dbQuery Result.failure(IngredientNotFoundError(qi.ingredient.id))
                }
                QuantifiedIngredientDao.new {
                    amount = qi.amount
                    unit = qi.unit
                    this.recipe = recipeDao
                    this.ingredient = ingredientDao
                }
            }
        }
        return@dbQuery Result.success(recipeDao.toRecipe())
    }
    
    override suspend fun deleteRecipe(id: Int): Result<Unit> = dbQuery {
        val recipe = RecipeDao.findById(id)
        if (recipe == null) {
            Result.failure(RecipeNotFoundError(id))
        } else {
            Result.success(Unit)
        }
    }
    
    private suspend fun <T> dbQuery(block: suspend Transaction.() -> T): T =
        newSuspendedTransaction(Dispatchers.IO) { block() }
}

fun RecipeService(
    database: Database,
    logger: Logger = LoggerFactory.getLogger(RecipeService::class.java)
) = RecipeServiceImpl(database, logger)

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
    val name: String? = null,
    val description: String? = null,
    val ingredients: List<QuantifiedIngredient>? = null
)

@Serializable
data class ShoppingListRequest(
    val recipeIds: List<Int>
)