package me.zwsmith.mealplan

import Recipe
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material.Button
import androidx.compose.material.MaterialTheme
import androidx.compose.material.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import kotlinx.coroutines.launch
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import org.jetbrains.compose.resources.painterResource
import org.jetbrains.compose.ui.tooling.preview.Preview

import mealmatch.composeapp.generated.resources.Res
import mealmatch.composeapp.generated.resources.compose_multiplatform

@Composable
@Preview
fun App() {
    val scope = rememberCoroutineScope()
    val api = remember { RecipeApi() }
    MaterialTheme {
        var showContent by remember { mutableStateOf(false) }
        var recipes by remember { mutableStateOf(mutableListOf<Recipe>())}
        Column(Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
            Button(onClick = {
                showContent = !showContent
                scope.launch {
                    recipes = api.getRecipes().toMutableList()
                }
            }) {

                Text("Click me!")
            }
            AnimatedVisibility(showContent) {
                Column(Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
                    val greeting = remember { Greeting().greet() }
                    Image(painterResource(Res.drawable.compose_multiplatform), null)
                    Text("Compose: $greeting")
                    recipes.forEach {
                        Text(it.name)
                    }
                }
            }
        }
    }
}

