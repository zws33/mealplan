type Meal = {id: number; calories: number; protein: number};

export function buildMealPlan(
  availableMeals: Meal[],
  mealCount: number,
  calorieLimit: number,
  proteinMin: number
): Meal[] | null {
  function backtrack(
    index: number,
    currentCalories: number,
    currentProtein: number,
    currentMeals: Meal[]
  ): Meal[] | null {
    if (currentMeals.length === mealCount) {
      if (currentCalories <= calorieLimit && currentProtein > proteinMin) {
        return [...currentMeals];
      }
      return null;
    }
    if (index === availableMeals.length) {
      return null;
    }

    const nextMeal = availableMeals[index];

    // Try including the current meal
    if (currentCalories + nextMeal.calories <= calorieLimit) {
      currentMeals.push(nextMeal);
      const result = backtrack(
        index + 1,
        currentCalories + nextMeal.calories,
        currentProtein + nextMeal.protein,
        currentMeals
      );
      if (result) {
        return result;
      }
      currentMeals.pop();
    }

    // Try excluding the current meal
    return backtrack(index + 1, currentCalories, currentProtein, currentMeals);
  }

  return backtrack(0, 0, 0, []);
}
