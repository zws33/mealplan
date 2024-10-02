/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
const FDC_API_KEY = process.env.FDC_API_KEY; // Ensure you set your API key

const FDC_API_BASE_URL = 'https://api.nal.usda.gov/fdc/v1/';
const LIST = 'foods/list';
const FOOD = 'food/';

async function foodList() {
  try {
    // Make the request to the FDC API
    const response = await fetchFoodList({
      dataType: ['SR Legacy'],
      pageSize: 15,
      pageNumber: 50,
    });
    const fdcIds = response.data.map((food: any) => food.fdcId);
    const results = [];
    for (const id of fdcIds) {
      const result = await fetchFoodById(id);
      results.push(result);
    }
    return results;
  } catch (error) {
    console.error('Error fetching food data:', error);
    throw new Error('Failed to fetch food data');
  }
}

async function fetchFoodList(
  options: {
    dataType?: string[];
    pageSize?: number;
    pageNumber?: number;
  } = {dataType: ['Foundation'], pageSize: 5, pageNumber: 1}
) {
  return await axios.post(
    FDC_API_BASE_URL + LIST,
    {
      ...options,
    },
    {
      params: {
        api_key: FDC_API_KEY,
      },
    }
  );
}
async function fetchFoodById(fdcId: number): Promise<{
  id: number;
  name: string;
  foodPortions: {
    servingSize: number;
    servingSizeUnit: string;
    gramWeight: number;
  }[];
  nutrients: {number: number; name: string; amount: number; unit: string}[];
}> {
  const result = await axios.get(FDC_API_BASE_URL + FOOD + fdcId, {
    params: {
      api_key: FDC_API_KEY,
      nutrients: '203,204,205', // Protein, carbohydrate, fat
    },
  });
  const name = result.data.description;
  const foodPortions = result.data.foodPortions?.map((fp: any) => {
    return {
      servingSize: fp.amount,
      servingSizeUnit: fp.modifier,
      gramWeight: fp.gramWeight,
    };
  });
  const nutrients = result.data.foodNutrients.map((fn: any) => {
    return {
      number: fn.nutrient.number,
      name: fn.nutrient.name,
      amount: fn.amount,
      unit: fn.nutrient.unitName,
    };
  });
  return {
    id: result.data.fdcId,
    name,
    foodPortions,
    nutrients,
  };
}
