import {groupBy} from '../util';

type MealType = 'breakfast' | 'lunch' | 'dinner';

type Meal = {
  id: number;
  calories: number;
  protein: number;
  mealType: MealType;
};

export class MealPlanBuilder {
  groupedMeals: Map<MealType, Meal[]>;
  mealCount: number;
  calorieLimit: number;
  desiredProteinPerMeal: number;
  constructor(
    private readonly availableMeals: Meal[],
    private readonly constraints: {
      numberOfDays: number;
      dailyCalorieLimit: number;
      desiredProteinPerMeal: number;
    }
  ) {
    this.groupedMeals = groupBy(availableMeals, meal => meal.mealType);
    this.mealCount = constraints.numberOfDays;
    this.calorieLimit =
      (constraints.dailyCalorieLimit * constraints.numberOfDays) / 3;
    this.desiredProteinPerMeal = constraints.desiredProteinPerMeal;
  }

  buildMealPlan(): Map<MealType, Meal[]> {
    const mealPlan = new Map<MealType, Meal[]>();
    for (const mealType of this.groupedMeals.keys()) {
      const meals = this.backtrack(this.groupedMeals.get(mealType)!);
      mealPlan.set(mealType, meals ? meals : []);
    }
    return mealPlan;
  }

  backtrack(
    availableMeals: Meal[],
    index = 0,
    currentCalories = 0,
    averageProtein = 0,
    currentMeals: Meal[] = []
  ): Meal[] | null {
    if (currentMeals.length === this.mealCount) {
      if (
        currentCalories <= this.calorieLimit &&
        averageProtein >= this.desiredProteinPerMeal
      ) {
        return [...currentMeals];
      }
      return null;
    }
    if (index === availableMeals.length) {
      return null;
    }

    const nextMeal = availableMeals[index];

    if (
      currentCalories + nextMeal.calories <= this.calorieLimit &&
      (averageProtein + nextMeal.protein) / (currentMeals.length + 1) >=
        this.desiredProteinPerMeal
    ) {
      currentMeals.push(nextMeal);
      const result = this.backtrack(
        availableMeals,
        index + 1,
        currentCalories + nextMeal.calories,
        (averageProtein + nextMeal.protein) / currentMeals.length,
        currentMeals
      );
      if (result) {
        return result;
      }
      currentMeals.pop();
    }

    return this.backtrack(
      availableMeals,
      index + 1,
      currentCalories,
      averageProtein,
      currentMeals
    );
  }
}
