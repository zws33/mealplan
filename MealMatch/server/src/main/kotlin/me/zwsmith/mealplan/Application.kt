package me.zwsmith.mealplan

import Recipe
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.calllogging.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.coroutines.launch
import me.zwsmith.mealplan.database.RecipeService
import me.zwsmith.plugins.database.connectToDatabase
import me.zwsmith.mealplan.recipes.recipeRouter
import me.zwsmith.plugins.database.recipeInputData
import org.slf4j.event.Level


fun main() {
    embeddedServer(Netty, port = SERVER_PORT, host = "0.0.0.0", module = Application::module)
        .start(wait = true)
}

fun Application.module() {
    install(CallLogging) {
        level = Level.INFO
        filter { call -> call.request.path().startsWith("/") }
    }
    install(ContentNegotiation) {
        json()
    }

    val database = connectToDatabase()
    val recipeService = RecipeService(database)
    seedDatabase(recipeService)
    recipeRouter(recipeService, log)
    routing {
        get("/") {
            val recipe = Recipe(
                id = 1,
                name = "Test",
                description = "Test",
                quantifiedIngredients = emptyList()
            )
            call.respond(recipe)
        }
    }
}

private fun Application.seedDatabase(recipeService: RecipeService) {
    launch {
        recipeInputData.forEach {
            recipeService.createRecipe(
                it.name,
                it.description,
                it.ingredients
            )
        }
    }
}

