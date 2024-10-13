package me.zwsmith.plugins.recipes

import io.ktor.http.HttpStatusCode
import io.ktor.server.application.Application
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.Routing
import io.ktor.server.routing.delete
import io.ktor.server.routing.get
import io.ktor.server.routing.post
import io.ktor.server.routing.put
import io.ktor.server.routing.route
import io.ktor.server.routing.routing
import me.zwsmith.plugins.Ingredient
import me.zwsmith.plugins.QuantifiedIngredient
import me.zwsmith.plugins.database.IngredientInput
import me.zwsmith.plugins.database.RecipeInput
import me.zwsmith.plugins.database.RecipeService
import me.zwsmith.plugins.database.RecipeUpdate
import me.zwsmith.plugins.database.ShoppingListRequest
import org.slf4j.Logger
import kotlin.text.toInt

fun Application.recipeRouter(recipeService: RecipeService, logger: Logger) {
    routing {
        recipeRouting(recipeService, logger)
        ingredientRoutes(recipeService, logger)
        shoppingListRoutes(recipeService, logger)
    }
}

private fun Routing.shoppingListRoutes(recipeService: RecipeService, logger: Logger) {
    post("/shoppinglist") {
        val recipeIds = call.receive<ShoppingListRequest>().recipeIds
        val recipes = recipeIds
            .mapNotNull { recipeId ->
                recipeService.findRecipeById(recipeId).getOrNull()
            }
            .asSequence()
            .map {
                it.quantifiedIngredients
            }
            .flatten()
            .groupBy { it.ingredient.name }
            .mapValues { (_, quantifiedIngredients) ->
                val initial = quantifiedIngredients.first().copy(amount = 0f)
                quantifiedIngredients.fold(initial) { total, quantifiedIngredient ->
                    total.copy(amount = total.amount + quantifiedIngredient.amount)
                }
            }
            .map { it.value }
            .toList()
        
        call.respond(HttpStatusCode.OK, recipes)
    }
}

fun Routing.ingredientRoutes(recipeService: RecipeService, logger: Logger) {
    route("/ingredients") {
        post {
            val ingredientInput = call.receive<IngredientInput>()
            val result = recipeService.createIngredient(ingredientInput.name)
            result.onSuccess {
                call.respond(it)
            }.onFailure {
                logger.error(it.message)
                call.respond(HttpStatusCode.InternalServerError, it.message ?: "Error creating ingredient")
            }
        }
        
        get("/{id}") {
            val id = call.parameters["id"]?.toInt() ?: return@get call.respond(HttpStatusCode.BadRequest)
            val result = recipeService.findIngredientById(id)
            result.onSuccess {
                call.respond(it)
            }.onFailure {
                when (it) {
                    is IllegalArgumentException -> {
                        call.respond(HttpStatusCode.NotFound)
                    }
                    
                    else -> {
                        logger.error(it.message)
                        call.respond(HttpStatusCode.InternalServerError)
                    }
                }
            }
        }
        
        put("/{id}") {
            val ingredient = call.receive<Ingredient>()
            val result = recipeService.updateIngredient(ingredient)
            result.onSuccess {
                call.respond(it)
            }.onFailure {
                logger.error(it.message)
                call.respond(HttpStatusCode.NotFound)
            }
        }
        
        delete("/{id}") {
            val id = call.parameters["id"]?.toInt() ?: return@delete call.respond(HttpStatusCode.BadRequest)
            recipeService.deleteIngredient(id).onSuccess {
                call.respond(HttpStatusCode.OK)
            }.onFailure {
                when (it) {
                    is IllegalArgumentException -> {
                        call.respond(HttpStatusCode.NotFound)
                    }
                    
                    else -> {
                        logger.error(it.message)
                        call.respond(HttpStatusCode.InternalServerError)
                    }
                }
            }
            
        }
    }
}

private fun Routing.recipeRouting(
    recipeService: RecipeService,
    logger: Logger
) {
    route("/recipes") {
        post {
            val recipeInput = call.receive<RecipeInput>()
            val result = recipeService.createRecipe(
                name = recipeInput.name,
                description = recipeInput.description,
                ingredientInputs = recipeInput.ingredients,
            )
            result.onSuccess {
                call.respond(HttpStatusCode.Created, it)
            }.onFailure {
                logger.error(it.message)
                call.respond(HttpStatusCode.InternalServerError)
            }
        }
        get("/{id}") {
            val id = call.parameters["id"]?.toInt() ?: return@get call.respond(HttpStatusCode.BadRequest)
            val result = recipeService.findRecipeById(id)
            result.onSuccess {
                call.respond(result.getOrThrow())
            }.onFailure {
                when (it) {
                    is IllegalArgumentException -> {
                        call.respond(HttpStatusCode.NotFound)
                    }
                    
                    else -> {
                        logger.error(it.message)
                        call.respond(HttpStatusCode.InternalServerError)
                    }
                }
            }
        }
        get {
            val result = recipeService.findRecipes()
            result.onSuccess {
                call.respond(HttpStatusCode.OK, result.getOrThrow())
            }.onFailure {
                logger.error(it.message)
                call.respond(HttpStatusCode.InternalServerError)
            }
        }
        put("/{id}") {
            val id = call.parameters["id"]?.toInt() ?: return@put call.respond(HttpStatusCode.BadRequest)
            val recipeUpdate = call.receive<RecipeUpdate>()
            val result = recipeService.updateRecipe(id, recipeUpdate)
            result.onSuccess {
                call.respond(HttpStatusCode.OK)
            }.onFailure {
                when (it) {
                    is IllegalArgumentException -> {
                        call.respond(HttpStatusCode.BadRequest, message = it.message ?: "Error updating recipe")
                    }
                    
                    else -> {
                        logger.error(it.message)
                        call.respond(HttpStatusCode.InternalServerError, message = "Error updating recipe")
                    }
                }
            }
        }
        post("/{id}/ingredients") {
            val id = call.parameters["id"]?.toInt() ?: return@post call.respond(HttpStatusCode.BadRequest)
            val ingredients = call.receive<List<QuantifiedIngredient>>()
            val result = recipeService.updateRecipeIngredients(id, ingredients)
            result.onSuccess {
                call.respond(HttpStatusCode.OK)
            }.onFailure {
                when (it) {
                    is RecipeService.RecipeNotFoundError -> {
                        call.respond(HttpStatusCode.NotFound, it.message ?: "Error updating recipe ingredients")
                    }
                    
                    else -> {
                        logger.error(it.message)
                        call.respond(HttpStatusCode.InternalServerError)
                    }
                }
                call.respond(HttpStatusCode.NotFound)
            }
        }
        delete("/{id}") {
            val id = call.parameters["id"]?.toInt() ?: return@delete call.respond(HttpStatusCode.BadRequest)
            recipeService.deleteRecipe(id)
                .onSuccess {
                    call.respond(HttpStatusCode.OK)
                }.onFailure {
                    call.respond(HttpStatusCode.NotFound)
                }
        }
    }
}