type Meal = {id: number; calories: number};

export function buildMealPlans(
  availableMeals: Meal[],
  mealCount: number,
  calorieLimit: number
): Meal[][] {
  const mealPlans: Meal[][] = [];
  let recurseCount = 0;
  function backtrack(
    index: number,
    currentCalories: number,
    currentMeals: Meal[]
  ) {
    console.log(recurseCount++);
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
    }
    backtrack(index + 1, currentCalories, currentMeals);
  }
  backtrack(0, 0, []);
  return mealPlans;
}
