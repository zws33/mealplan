type Meal = {id: number; calories: number};

export function buildMealPlans(
  availableMeals: Meal[],
  mealCount: number,
  calorieLimit: number
): Meal[][] {
  const mealPlans: Meal[][] = [];
  function backtrack(
    index: number,
    currentMeals: Meal[],
    currentCalories: number,
    calorieLimit: number,
    mealCount: number
  ) {
    if (currentMeals.length === mealCount) {
      if (currentCalories <= calorieLimit) {
        mealPlans.push(currentMeals.slice());
      }
      return;
    }
    for (let i = index; i < availableMeals.length; i++) {
      const meal = availableMeals[i];
      if (currentCalories + meal.calories > calorieLimit) {
        continue;
      }
      currentMeals.push(meal);
      backtrack(
        i + 1,
        currentMeals,
        currentCalories + meal.calories,
        calorieLimit,
        mealCount
      );
      currentMeals.pop();
    }
  }
  backtrack(0, [], 0, calorieLimit, mealCount);
  return mealPlans;
}
