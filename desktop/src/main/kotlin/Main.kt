import androidx.compose.desktop.ui.tooling.preview.Preview
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.material.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlin.time.Duration.Companion.seconds

@Composable
@Preview
fun App(fetchRecipes: suspend () -> List<Recipe>) {
    val coroutineScope = rememberCoroutineScope()
    
    MaterialTheme {
        var state: UiState<List<Recipe>> by remember { mutableStateOf(UiState.Success(emptyList())) }
        Surface(modifier = Modifier.fillMaxSize()) {
            RecipeList(state, fetchRecipes = {
                state = UiState.Loading
                coroutineScope.launch {
                    try {
                        delay(2.seconds)
                        if ((0..3).random() == 3) {
                            throw Exception("Connection refused.")
                        } else {
                            val data = fetchRecipes()
                            state = UiState.Success(data)
                        }
                    } catch (e: Throwable) {
                        state = UiState.Error(e)
                    }
                }
            })
        }
    }
}

@Composable
fun RecipeList(
    state: UiState<List<Recipe>>,
    fetchRecipes: () -> Unit,
) {
    Column(modifier = Modifier.fillMaxSize().padding(40.dp)) {
        when (state) {
            is UiState.Error -> {
                val errorMessage = state.e.message
                ErrorCard(modifier = Modifier.weight(1f), errorMessage)
            }
            
            UiState.Loading -> {
                LoadingSpinner(modifier = Modifier.weight(1f))
            }
            
            is UiState.Success -> {
                LazyVerticalGrid(
                    columns = GridCells.Adaptive(minSize = 300.dp),
                    modifier = Modifier.weight(1f)
                ) {
                    items(
                        count = state.data.size,
                        key = { state.data[it].id }
                    ) { index ->
                        RecipeItem(recipe = state.data[index])
                    }
                }
            }
        }
        Spacer(modifier = Modifier.height(8.dp))
        FetchButton(
            modifier = Modifier.size(height = 56.dp, width = 120.dp),
            buttonText = "Fetch Recipes",
            onClick = fetchRecipes,
            isLoading = state is UiState.Loading,
        )
    }
}

sealed class UiState<out T> {
    data class Error(val e: Throwable) : UiState<Nothing>()
    data object Loading : UiState<Nothing>()
    data class Success<T>(val data: T) : UiState<T>()
}

fun main() = application {
    val repository = Repository(client)
    Window(onCloseRequest = ::exitApplication, title = "MealPlan") {
        App(repository::fetchRecipes)
    }
}





