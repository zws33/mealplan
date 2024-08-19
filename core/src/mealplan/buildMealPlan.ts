type Meal = {id: number; calories: number};

export function buildMealPlans(
  availableMeals: Meal[],
  mealCount: number,
  calorieLimit: number
): Meal[][] {
  const mealPlans: Meal[][] = [];
  function backtrack(
    index: number,
    currentCalories: number,
    currentMeals: Meal[]
  ) {
    if (currentMeals.length === mealCount) {
      if (currentCalories <= calorieLimit) {
        mealPlans.push([...currentMeals]);
        return;
      }
    }
    if (index === availableMeals.length) {
      return;
    }
    const nextMeal = availableMeals[index];
    if (currentCalories + nextMeal.calories < calorieLimit) {
      currentMeals.push(nextMeal);
      backtrack(index + 1, currentCalories + nextMeal.calories, currentMeals);
      currentMeals.pop();
    } else {
      backtrack(index + 1, currentCalories, currentMeals);
    }
  }
  backtrack(0, 0, []);
  return mealPlans;
}
