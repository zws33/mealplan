type Ingredient = {
  name: string;
  unit: string;
  servingSize: number;
  protein: number;
  carbohydrates: number;
  fat: number;
};

type Nutrient = {
  name: string;
  amount: number;
  unit: string;
};

export class SpoonacularClient {
  private readonly baseUrl = 'https://api.spoonacular.com/food/ingredients/';
  constructor(private readonly apiKey: string) {}
  getUrl(id: number) {
    const url = new URL(this.baseUrl + `${id}/information`);
    url.searchParams.append('amount', '100');
    url.searchParams.append('unit', 'g');
    url.searchParams.append('apiKey', this.apiKey);
    return url;
  }

  async getNutritionInfo(id: number): Promise<Ingredient> {
    const url = this.getUrl(id);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const ingredientData: any = await response.json();
    const nutrients = ingredientData.nutrition.nutrients;
    const ingredient: Ingredient = {
      name: ingredientData.name,
      unit: ingredientData.unit,
      servingSize: ingredientData.amount,
      protein: nutrients.find(
        (nutrient: Nutrient) => nutrient.name === 'Protein'
      ).amount,
      carbohydrates: nutrients.find(
        (nutrient: Nutrient) => nutrient.name === 'Carbohydrates'
      ).amount,
      fat: nutrients.find((nutrient: Nutrient) => nutrient.name === 'Fat')
        .amount,
    };

    return ingredient;
  }
}
