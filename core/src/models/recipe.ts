export type Recipe = {
  id: number;
  name: string;
  nutrition: {calories: number; fat: number; carbs: number; protein: number};
  ingredients: Ingredient[];
  instructions: Instruction[];
};

export type Ingredient = {
  id: number;
  name: string;
  quantity: Quantity;
};

export type Quantity = {
  unit: string;
  scalar: number;
};

export type Instruction = {
  description: string;
};
