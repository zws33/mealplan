import {ModelGenerator} from './modelGenerator';

describe('ModelGenerator', () => {
  describe('generateIngredient', () => {
    test('should generate a single ingredient', () => {
      const ingredients = new ModelGenerator().generateIngredient();
      expect(ingredients).toBeDefined();
      expect(ingredients.length).toBe(1);

      const ingredient = ingredients[0];
      expect(ingredient.id).toBeGreaterThanOrEqual(0);
      expect(ingredient.id).toBeLessThanOrEqual(10000);
      expect(ingredient.name).toBeDefined();
      expect(ingredient.unit).toBe('g');
      expect(ingredient.servingSize).toBe(100);
      expect(ingredient.protein).toBeGreaterThanOrEqual(1);
      expect(ingredient.protein).toBeLessThanOrEqual(100);
      expect(ingredient.carbohydrates).toBeGreaterThanOrEqual(1);
      expect(ingredient.carbohydrates).toBeLessThanOrEqual(100);
      expect(ingredient.fat).toBeGreaterThanOrEqual(1);
      expect(ingredient.fat).toBeLessThanOrEqual(100);
    });

    test('should generate multiple ingredients', () => {
      const count = 5;
      const ingredients = new ModelGenerator().generateIngredient(count);
      expect(ingredients.length).toEqual(count);
      const ids = new Set<number>();
      ingredients.forEach(ingredient => {
        ids.add(ingredient.id);
      });
      expect(ids.size).toEqual(count);
      ingredients.forEach(ingredient => {
        expect(ingredient).toBeDefined();
        expect(ingredient.id).toBeGreaterThanOrEqual(0);
        expect(ingredient.id).toBeLessThanOrEqual(10000);
        expect(ingredient.name).toBeDefined();
        expect(ingredient.unit).toBe('g');
        expect(ingredient.servingSize).toBe(100);
        expect(ingredient.protein).toBeGreaterThanOrEqual(1);
        expect(ingredient.protein).toBeLessThanOrEqual(100);
        expect(ingredient.carbohydrates).toBeGreaterThanOrEqual(1);
        expect(ingredient.carbohydrates).toBeLessThanOrEqual(100);
        expect(ingredient.fat).toBeGreaterThanOrEqual(1);
        expect(ingredient.fat).toBeLessThanOrEqual(100);
      });
    });
  });

  test('generateInstruction', () => {
    const instructions = new ModelGenerator().generateInstructions();
    expect(instructions).toBeDefined();
    expect(instructions.length).toBe(1);
    const instruction = instructions[0];
    expect(instruction.description).toBeDefined();
  });

  test('generate instructions', () => {
    const count = 5;
    const instructions = new ModelGenerator().generateInstructions(count);
    expect(instructions.length).toEqual(count);
    instructions.forEach(instruction => {
      expect(instruction).toBeDefined();
      expect(instruction.description).toBeDefined();
    });
  });

  test('generate receipe', () => {
    const recipes = new ModelGenerator().generateRecipes();
    expect(recipes).toBeDefined();
    expect(recipes.length).toBe(1);
    const recipe = recipes[0];
    expect(recipe.id).toBeGreaterThanOrEqual(0);
    expect(recipe.id).toBeLessThanOrEqual(1000);
    expect(recipe.mealType).toBeDefined();
    expect(recipe.name).toBeDefined();
    expect(recipe.ingredients).toBeDefined();
    expect(recipe.instructions).toBeDefined();
  });

  test('generate multiple recipes', () => {
    const count = 5;
    const recipes = new ModelGenerator().generateRecipes(count);
    expect(recipes.length).toEqual(count);
    const ids = new Set<number>(recipes.map(recipe => recipe.id));
    expect(ids.size).toEqual(count);
    recipes.forEach(recipe => {
      expect(recipe).toBeDefined();
      expect(recipe.mealType).toBeDefined();
      expect(recipe.name).toBeDefined();
      expect(recipe.ingredients).toBeDefined();
      expect(recipe.instructions).toBeDefined();
    });
  });
});
