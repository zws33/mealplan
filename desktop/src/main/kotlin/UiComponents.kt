@file:Suppress("FunctionName")

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.*
import androidx.compose.material.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp

@Composable
fun RecipeItem(
    modifier: Modifier = Modifier,
    recipe: Recipe
) {
    Box(modifier.padding(4.dp)) {
        Card(
            modifier = Modifier.fillMaxWidth(),
            backgroundColor = MaterialTheme.colors.surface,
            elevation = 4.dp,
        ) {
            Column(modifier = Modifier.padding(8.dp)) {
                Text("Recipe: ${recipe.name}")
            }
        }
    }
}

@Composable
fun FetchButton(
    modifier: Modifier = Modifier,
    onClick: () -> Unit,
    isLoading: Boolean,
    buttonText: String
) {
    Button(
        onClick = onClick,
        modifier = modifier,
        enabled = !isLoading,
        colors = ButtonDefaults.buttonColors(disabledBackgroundColor = MaterialTheme.colors.primary.copy(alpha = 0.3f))
    ) {
        if (isLoading) {
            CircularProgressIndicator(
                modifier = Modifier.size(24.dp),
                color = MaterialTheme.colors.onPrimary
            )
        } else {
            Text(
                text = buttonText,
                textAlign = TextAlign.Center
            )
        }
    }
}

@Composable
fun ErrorCard(modifier: Modifier = Modifier, errorMessage: String?) {
    Box(modifier = modifier.padding(4.dp)) {
        Card(
            border = BorderStroke(width = 2.dp, color = MaterialTheme.colors.error),
            elevation = 4.dp
        ) {
            Column(
                modifier = Modifier.fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    "Error fetching recipes.",
                    style = MaterialTheme.typography.h2,
                    color = MaterialTheme.colors.error
                )
                errorMessage?.let { Text(it, style = MaterialTheme.typography.h3, color = MaterialTheme.colors.error) }
            }
        }
    }
}

@Composable
fun LoadingSpinner(modifier: Modifier) {
    Box(modifier = modifier) {
        Column(modifier = Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
            Text("Fetching Recipes...", style = MaterialTheme.typography.h2)
            CircularProgressIndicator(modifier = Modifier.size(56.dp))
        }
    }
}