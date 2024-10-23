import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.serialization.json.Json

val client by lazy {
    HttpClient(CIO) {
        install(ContentNegotiation) {
            json(Json {
                ignoreUnknownKeys = true
            })
        }
    }
}

class Repository(private val client: HttpClient) {
    suspend fun fetchRecipes(): List<Recipe> {
        // Fetch the data from the server
        val response: HttpResponse = client.get("https://zwsmith.me/recipes") {
            parameter("mealType", "lunch")
        }
        
        // Deserialize the response to a list of Recipe
        val recipes: List<Recipe> = response.body()
        
        return recipes
    }
}