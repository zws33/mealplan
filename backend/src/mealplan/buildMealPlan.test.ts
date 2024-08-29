import {buildMealPlan} from './buildMealPlan';

test('buildMealPlans returns correct meal plans', () => {
  const meals = [
    {id: 1, calories: 600},
    {id: 2, calories: 400},
    {id: 3, calories: 500},
    {id: 4, calories: 350},
    {id: 5, calories: 300},
    {id: 6, calories: 400},
    {id: 7, calories: 500},
    {id: 8, calories: 600},
    {id: 9, calories: 250},
    {id: 10, calories: 350},
  ];
  const mealPlans = buildMealPlan(meals, 3, 1700);
  expect(mealPlans.length).toEqual(118);
});
