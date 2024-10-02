/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

// Define interfaces for the response types
interface Nutrient {
  nutrientName: string;
  value: number;
  unitName: string;
}

interface FoodNutrient {
  nutrients: Nutrient[];
}

interface FoodSearchResult {
  description: string;
  servingSize: number;
  servingSizeUnit: string;
  nutrients: {
    protein: number;
    carbohydrates: number;
    fat: number;
  };
}

const FDC_API_KEY = process.env.FDC_API_KEY; // Ensure you set your API key

const FDC_API_BASE_URL = 'https://api.nal.usda.gov/fdc/v1/foods/search';

async function searchFood(searchTerm: string): Promise<FoodSearchResult> {
  try {
    // Make the request to the FDC API
    const response = await axios.post(
      FDC_API_BASE_URL,
      {
        query: searchTerm,
        pageSize: 100, // Get top 100 results
      },
      {
        params: {
          api_key: FDC_API_KEY,
        },
      }
    );

    // Filter foods with a defined serving size
    const foods = response.data.foods.filter(
      (food: any) => food.servingSize && food.servingSizeUnit === 'g'
    );

    if (foods.length === 0) {
      throw new Error('No foods with a defined serving size found.');
    }

    // Find the most common serving size
    const servingSizeCountMap: Record<number, number> = {};
    foods.forEach((food: any) => {
      const servingSize = food.servingSize;
      servingSizeCountMap[servingSize] =
        (servingSizeCountMap[servingSize] || 0) + 1;
    });

    const mostCommonServingSize = Object.keys(servingSizeCountMap)
      .map(Number)
      .reduce((a, b) =>
        servingSizeCountMap[a] > servingSizeCountMap[b] ? a : b
      );

    // Filter foods by the most common serving size
    const filteredFoods = foods.filter(
      (food: any) => food.servingSize === mostCommonServingSize
    );

    // Initialize nutrient totals
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    // Iterate through filtered foods and sum nutrient values
    filteredFoods.forEach((food: any) => {
      food.foodNutrients.forEach((nutrient: any) => {
        switch (nutrient.nutrientName.toLowerCase()) {
          case 'protein':
            totalProtein += nutrient.value;
            break;
          case 'carbohydrate, by difference':
            totalCarbs += nutrient.value;
            break;
          case 'total lipid (fat)':
            totalFat += nutrient.value;
            break;
        }
      });
    });

    // Calculate averages for nutrients
    const foodCount = filteredFoods.length;
    const averageProtein = totalProtein / foodCount;
    const averageCarbs = totalCarbs / foodCount;
    const averageFat = totalFat / foodCount;

    return {
      description: `Average values for most common serving size (${mostCommonServingSize}g)`,
      servingSize: mostCommonServingSize,
      servingSizeUnit: filteredFoods[0].servingSizeUnit, // Assuming the unit is the same for all
      nutrients: {
        protein: averageProtein,
        carbohydrates: averageCarbs,
        fat: averageFat,
      },
    };
  } catch (error) {
    console.error('Error fetching food data:', error);
    throw new Error('Failed to fetch food data');
  }
}
