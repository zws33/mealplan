import {RecipeTag} from '../models/models';

type Meal = {
  id: number;
  calories: number;
  protein: number;
  tags: RecipeTag[];
};

export class MealPlanBuilder {
  availableMeals: Meal[];
  mealCount: number;
  calorieLimit: number;
  desiredProteinPerMeal: number;
  constructor(
    availableMeals: Meal[],
    constraints: {
      numberOfDays: number;
      dailyCalorieLimit: number;
      desiredProteinPerMeal: number;
    }
  ) {
    this.availableMeals = availableMeals;
    this.mealCount = constraints.numberOfDays;
    this.calorieLimit =
      (constraints.dailyCalorieLimit * constraints.numberOfDays) / 3;
    this.desiredProteinPerMeal = constraints.desiredProteinPerMeal;
  }

  buildMealPlan(): Map<RecipeTag, Meal[]> {
    const mealPlan = new Map<RecipeTag, Meal[]>();
    const breakfast = this.availableMeals.filter(meal =>
      meal.tags.includes('breakfast')
    );
    const lunch = this.availableMeals.filter(meal =>
      meal.tags.includes('lunch')
    );
    const dinner = this.availableMeals.filter(meal =>
      meal.tags.includes('dinner')
    );
    mealPlan.set('breakfast', this.backtrack(breakfast) || []);
    mealPlan.set('lunch', this.backtrack(lunch) || []);
    mealPlan.set('dinner', this.backtrack(dinner) || []);
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
