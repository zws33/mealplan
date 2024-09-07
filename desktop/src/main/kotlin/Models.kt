import kotlinx.serialization.Serializable

@Serializable
data class Recipe(
    val id: Int,
    val mealType: String,
    val name: String,
    val ingredients: List<QuantifiedIngredient>,
    val instructions: List<Instruction>
)

@Serializable
data class QuantifiedIngredient(
    val ingredient: Ingredient,
    val amount: Double
)

@Serializable
data class Ingredient(
    val id: Int,
    val name: String,
    val unit: String,
    val servingSize: Int,
    val protein: Double,
    val carbohydrates: Double,
    val fat: Double
)

@Serializable
data class Instruction(
    val description: String
)

data class Macros(
    val fat: Double,
    val carbohydrate: Double,
    val protein: Double
)

fun Recipe.getMacros(): Macros {
    val macros = ingredients.map(::getMacrosForIngredient)
    
    return macros.reduce { sum, current ->
        Macros(
            fat = sum.fat + current.fat,
            carbohydrate = sum.carbohydrate + current.carbohydrate,
            protein = sum.protein + current.protein
        )
    }
}

fun getMacrosForIngredient(quantifiedIngredient: QuantifiedIngredient): Macros {
    val ingredient = quantifiedIngredient.ingredient
    val amount = quantifiedIngredient.amount
    val multiplier = amount / ingredient.servingSize
    
    return Macros(
        fat = ingredient.fat * multiplier,
        carbohydrate = ingredient.carbohydrates * multiplier,
        protein = ingredient.protein * multiplier
    )
}