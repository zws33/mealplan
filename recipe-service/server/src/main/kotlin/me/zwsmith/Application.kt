package me.zwsmith

import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import kotlinx.coroutines.launch
import me.zwsmith.plugins.*
import me.zwsmith.plugins.database.RecipeService
import me.zwsmith.plugins.database.connectToDatabase
import me.zwsmith.plugins.recipes.recipeRouter
import me.zwsmith.plugins.database.recipeInputData

fun main() {
    embeddedServer(Netty, port = 8080, host = "0.0.0.0", module = Application::module)
        .start(wait = true)
}

fun Application.module() {
    configureMonitoring()
    configureSerialization()
    val database = connectToDatabase()
    val recipeService = RecipeService(database)
    seedDatabase(recipeService)
    recipeRouter(recipeService, log)
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

