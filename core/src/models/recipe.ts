export type Recipe = {
  id: number;
  name: string;
  nutrition: {calories: number; fat: number; carbs: number; protein: number};
  ingredients: QuqntifiedIngredient[];
  instructions: Instruction[];
};

export type QuqntifiedIngredient = {
  ingredient: Ingredient;
  quantity: Quantity;
};

export type Ingredient = {
  id: number;
  name: string;
};

export type Quantity = {
  unit: string;
  scalar: number;
};

export type Instruction = {
  description: string;
};
