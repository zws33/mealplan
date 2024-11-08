package me.zwsmith.mealplan

import Recipe
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.serialization.kotlinx.json.*

class RecipeApi {
    private val client = HttpClient {
        install(ContentNegotiation) {
            json()
        }
    }

    suspend fun getRecipes(): List<Recipe> {
        val response = client.get("https://zwsmith.me/zws-33-mealplan-api/recipes")
        return response.body()
    }
}