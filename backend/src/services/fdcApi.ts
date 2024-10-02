/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

interface SearchResultFood {
  fdcId: number;
  description: string;
  foodNutrients: AbridgedFoodNutrient[];
}
type AbridgedFoodNutrient = {
  nutrientId: number;
  nutrientNumber: number;
  unit: string;
  number?: number;
  name?: string;
  amount?: number;
  unitName?: string;
  derivationCode?: string;
  derivationDescription?: string;
};
class FdcApi {
  #FDC_API_KEY = process.env.FDC_API_KEY;
  #FDC_API_BASE_URL = 'https://api.nal.usda.gov/fdc/v1/';
  #FOOD_LIST = 'foods/list';
  #FOOD = 'food/';
  #FOOD_SEARCH = 'foods/search';
  #CARB_ID = 1005;
  #FAT_ID = 1004;
  #PROTEIN_ID = 1003;
  async search(query: string, {pageSize = 10, pageNumber = 1}) {
    try {
      const response = await axios.post(
        `${this.#FDC_API_BASE_URL}${this.#FOOD_SEARCH}`,
        {
          query,
          pageSize,
          pageNumber,
          dataType: ['SR Legacy'],
        },
        {
          params: {
            api_key: this.#FDC_API_KEY,
          },
        }
      );
      const foods = response.data.foods.map((food: SearchResultFood) => {
        return {
          id: food.fdcId,
          description: food.description,
          nutrients: food.foodNutrients.filter(
            n =>
              n.nutrientId === this.#CARB_ID ||
              n.nutrientId === this.#PROTEIN_ID ||
              n.nutrientId === this.#FAT_ID
          ),
        };
      });
      console.dir(foods, {depth: null});
      return foods;
    } catch (error) {
      console.error('Error fetching food data:', error);
      throw new Error('Failed to fetch food data');
    }
  }
}

export const fdcApi = new FdcApi();
fdcApi
  .search('apple', {})
  .then(foods => {
    //
  })
  .catch(error => {
    console.error(error);
  });
