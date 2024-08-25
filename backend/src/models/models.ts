export type Recipe = {
  id: number;
  name: string;
  ingredients: QuantifiedIngredient[];
  instructions: Instruction[];
};

export type QuantifiedIngredient = {
  ingredient: Ingredient;
  quantity: number;
  unit: string;
};

export type Ingredient = {
  id: number;
  name: string;
};

export type Instruction = {
  description: string;
};

export type Nutrition = {
  ingredient_id: number;
  unit: string;
  calories: number;
  fat: number;
  carbs: number;
  protein: number;
};
