import { Client } from 'pg';

// Define the Ingredient data structure
type Nutrient = {
  amount: number;
  unit: string;
};

type Portion = {
  amount: number;
  modifier: string;
  gramWeight: number;
  description: string;
};

const nutrientNames = ['protein', 'fat', 'carbohydrate'] as const;
type NutrientName = (typeof nutrientNames)[number];
type Ingredient = {
  name: string;
  portions: Portion[];
  nutrition: Record<NutrientName, Nutrient | undefined>;
};

type Nutrients = Record<string, Nutrient>;

// Database configuration (update with your own connection details)
const client = new Client({
  user: Bun.env.POSTGRES_USER,
  database: Bun.env.POSTGRES_DB,
  host: 'localhost',
  password: Bun.env.POSTGRES_PASSWORD,
  port: 5432,
});

async function getIngredients(searchString: string): Promise<Ingredient[]> {
  await client.connect();

  // Query to get the relevant data
  // Query to get the relevant data with a filter on food description
  const query = `
    SELECT 
      f.description AS food_description,
      fn.amount AS nutrient_amount,
      n.name AS nutrient_name,
      n.unit_name AS nutrient_unit_name,
      fp.amount AS portion_amount,
      fp.modifier AS portion_modifier,
      fp.gram_weight AS portion_gram_weight,
      fp.portion_description
    FROM 
      food f
    JOIN 
      food_nutrient fn ON f.fdc_id = fn.fdc_id
    JOIN 
      nutrient n ON fn.nutrient_id = n.id
    JOIN 
      food_portion fp ON f.fdc_id = fp.fdc_id
    WHERE 
      n.name IN ('Protein', 'Total lipid (fat)', 'Carbohydrate, by difference')
    AND 
      f.description ILIKE $1;
  `;

  // Use % wildcards around the search string for partial matching
  const values = [`%${searchString}%`];

  const result = await client.query(query, values);

  const ingredientMap: Map<string, Ingredient> = new Map();

  result.rows.forEach((row) => {
    const foodName = row.food_description;

    // If ingredient does not exist in map, create it
    if (!ingredientMap.has(foodName)) {
      const newIngredient: Ingredient = {
        name: foodName,
        portions: [],
        nutrition: {
          protein: undefined,
          fat: undefined,
          carbohydrate: undefined,
        },
      };
      ingredientMap.set(foodName, newIngredient);
    }

    // Add portion information to the existing ingredient
    const ingredient = ingredientMap.get(foodName)!;

    const portion: Portion = {
      amount: row.portion_amount,
      modifier: row.portion_modifier,
      gramWeight: row.portion_gram_weight,
      description: row.portion_description,
    };

    // Check if the portion already exists in the portions list (to avoid duplicates)
    const existingPortion = ingredient.portions.find(
      (p) =>
        p.amount === portion.amount &&
        p.modifier === portion.modifier &&
        p.gramWeight === portion.gramWeight &&
        p.description === portion.description
    );

    // Add the portion only if it's not already present
    if (!existingPortion) {
      ingredient.portions.push(portion);
    }

    // Add nutrient information to the existing ingredient
    const nutrient: Nutrient = {
      amount: row.nutrient_amount,
      unit: row.nutrient_unit_name,
    };
    switch (row.nutrient_name) {
      case 'Protein':
        ingredient.nutrition.protein = nutrient;
        break;
      case 'Total lipid (fat)':
        ingredient.nutrition.fat = nutrient;
        break;
      case 'Carbohydrate, by difference':
        ingredient.nutrition.carbohydrate = nutrient;
        break;
      default:
        break;
    }
  });

  await client.end();

  // Convert Map values to array and return
  return Array.from(ingredientMap.values());
}

// Usage
if (!Bun.argv[2]) {
  console.error('Please provide a search string.');
} else {
  const searchString = Bun.argv[2] || '';
  getIngredients(searchString)
    .then((ingredients) => {
      for (let i = 0; i < 10; i++) {
        console.dir(ingredients[i], { depth: null });
      }
    })
    .catch((err) => {
      console.error('Error fetching ingredients:', err);
    });
}
