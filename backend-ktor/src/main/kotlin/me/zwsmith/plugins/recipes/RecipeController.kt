package me.zwsmith.plugins.recipes

import io.ktor.http.HttpStatusCode
import io.ktor.server.application.Application
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.delete
import io.ktor.server.routing.get
import io.ktor.server.routing.post
import io.ktor.server.routing.put
import io.ktor.server.routing.routing
import me.zwsmith.plugins.Ingredient
import me.zwsmith.plugins.QuantifiedIngredient
import me.zwsmith.plugins.database.IngredientInput
import me.zwsmith.plugins.database.RecipeInput
import me.zwsmith.plugins.database.RecipeService
import me.zwsmith.plugins.database.RecipeUpdate
import me.zwsmith.plugins.database.ShoppingListRequest

fun Application.recipeRouter(recipeService: RecipeService) {
    routing {
        post("/recipes") {
            val recipeInput = call.receive<RecipeInput>()
            val recipe = recipeService.createRecipe(
                name = recipeInput.name,
                description = recipeInput.description,
                ingredientInputs = recipeInput.ingredients,
            )
            call.respond(HttpStatusCode.Created, recipe)
        }
        get("/recipes/{id}") {
            val id = call.parameters["id"]?.toInt() ?: return@get call.respond(HttpStatusCode.BadRequest)
            val recipe = recipeService.findRecipeById(id)
            if (recipe == null) {
                call.respond(HttpStatusCode.NotFound)
            } else {
                call.respond(recipe)
            }
        }
        get("/recipes") {
            val recipes = recipeService.findRecipes()
            call.respond(HttpStatusCode.OK, recipes)
        }
        put("/recipes/{id}") {
            val id = call.parameters["id"]?.toInt() ?: return@put call.respond(HttpStatusCode.BadRequest)
            val recipeUpdate = call.receive<RecipeUpdate>()
            try {
                recipeService.updateRecipe(id, recipeUpdate)
                call.respond(HttpStatusCode.OK)
            } catch (e: Exception) {
                when (e) {
                    is IllegalArgumentException -> {
                        call.respond(HttpStatusCode.BadRequest, message = e.message ?: "Error updating recipe")
                    }
                    else -> {
                        call.respond(HttpStatusCode.InternalServerError, message = "Error updating recipe")
                    }
                }
            }
        }
        
        post("/recipes/{id}/ingredients") {
            val id = call.parameters["id"]?.toInt() ?: return@post call.respond(HttpStatusCode.BadRequest)
            val ingredients = call.receive<List<QuantifiedIngredient>>()
            recipeService.updateRecipeIngredients(id, ingredients)
            call.respond(HttpStatusCode.OK)
        }
        delete("/recipes/{id}") {
            val id = call.parameters["id"]?.toInt() ?: return@delete call.respond(HttpStatusCode.BadRequest)
            val result = recipeService.deleteRecipe(id)
            if (result) {
                call.respond(HttpStatusCode.OK)
            } else {
                call.respond(HttpStatusCode.NotFound)
            }
        }
    }
    
    routing {
        post("/ingredients") {
            val ingredientInput = call.receive<IngredientInput>()
            val ingredient = recipeService.createIngredient(ingredientInput.name)
            call.respond(ingredient)
        }
        
        get("/ingredients/{id}") {
            val id = call.parameters["id"]?.toInt() ?: return@get call.respond(HttpStatusCode.BadRequest)
            val ingredient = recipeService.findIngredientById(id)
            if (ingredient == null) {
                call.respond(HttpStatusCode.NotFound)
            } else {
                call.respond(ingredient)
            }
        }
        
        put("/ingredients/{id}") {
            val ingredient = call.receive<Ingredient>()
            val updatedIngredient = recipeService.updateIngredient(ingredient)
            if (updatedIngredient != null) {
                call.respond(updatedIngredient)
            } else {
                call.respond(HttpStatusCode.NotFound)
            }
        }
        
        delete("/ingredients/{id}") {
            val id = call.parameters["id"]?.toInt() ?: return@delete call.respond(HttpStatusCode.BadRequest)
            if (recipeService.deleteIngredient(id)) {
                call.respond(HttpStatusCode.OK)
            } else {
                call.respond(HttpStatusCode.ExpectationFailed)
            }
        }
    }
    
    routing {
        post("/shoppinglist") {
            val recipeIds = call.receive<ShoppingListRequest>().recipeIds
            val recipes = recipeIds
                .mapNotNull { recipeId ->
                    recipeService.findRecipeById(recipeId)
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
}