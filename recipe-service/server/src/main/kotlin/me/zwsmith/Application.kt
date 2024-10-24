package me.zwsmith

import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.html.respondHtml
import io.ktor.server.netty.*
import io.ktor.server.routing.get
import io.ktor.server.routing.routing
import kotlinx.coroutines.launch
import kotlinx.html.body
import kotlinx.html.div
import kotlinx.html.h1
import kotlinx.html.head
import kotlinx.html.p
import kotlinx.html.style
import kotlinx.html.title
import me.zwsmith.plugins.*
import me.zwsmith.plugins.database.RecipeService
import me.zwsmith.plugins.database.connectToDatabase
import me.zwsmith.plugins.database.recipeInputData
import me.zwsmith.plugins.recipes.recipeRouter

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
    routing {
        get("/") {
            call.respondHtml {
                head {
                    title("MealPlan App - Coming Soon")
                    style {
                        +"""
                            body {
                                font-family: Arial, sans-serif;
                                background: #f4f4f4;
                                text-align: center;
                                color: #333;
                                margin: 0;
                            }
                            .container {
                                max-width: 600px;
                                margin: 100px auto;
                                padding: 20px;
                                background: white;
                                border-radius: 8px;
                                box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
                            }
                            h1 {
                                font-size: 36px;
                                margin-bottom: 10px;
                            }
                            p {
                                font-size: 20px;
                                margin-top: 0;
                            }
                            """
                    }
                }
                body {
                    div("container") {
                        h1 { +"MealPlan App" }
                        p { +"Our site is currently a work in progress." }
                        p { +"Stay tuned, we're coming soon!" }
                    }
                }
            }
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

