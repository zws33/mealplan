# Meal Plan App

## Goal:

Create an application to help with planning meals that meet nutrution goals

## Requirements/User Stories

- There is a shared public store of recipes
- Users can perform CRUD operations on their own recipes
- Users can set nutritional goals
  - Calories max/day
  - Protein min/day
- User can request a meal plan for the week that meets their nutritional goals
  - Calories should be distributed evenly
  - Meals should not be duplicated
- User can request a shopping list for the ingredients needed for the meal plan

## System Design

- API Gateway/Reverse Proxy
  - Orchestration layer for the application
  - Requests from clients will be routed to necessary backend services
- Meal Plan Service

  - Exposes endpoints for CRUD interations with meal plans
    ```json
    HTTP GET /v1/mealplans?latest=true
    ```

- Recipe Service
  - Exposes endpoints for CRUD interations with recipes
    ```json
    HTTP POST /v1/recipes
    body: {
        "recipeName": "chicken and waffles",
        "quantifiedIngredients": [
            {
                "ingredient": {
                    "ingredientId": 1,
                    "ingredientName": "apple",
                    "macros": {
                        "protein": 1,
                        "carbohydrates": 1,
                        "fat": 1
                    }
                },
                "quantity": {
                    "unit": "millileters",
                    "scalar": 1
                }
            }
        ],
        "instructions": [
            {
                "description": "boil water"
            }
        ]
    }
    ```
    ```json
    HTTP GET /v1/recipes/:id
    response: {
        "recipeId": 1,
        "recipeName": "chicken and waffles",
        "quantifiedIngredients": [
            {
            "ingredient": {
                "ingredientId": 1,
                "macros": {
                "protein": 1,
                "carbohydrates": 1,
                "fat": 1
                }
            },
            "quantity": {
                "unit": "millileters",
                "scalar": 1
            }
            }
        ],
        "instructions": [
            {
            "description": "boil water"
            }
        ]
    }
    ```
- Meal Plan DB

  ```json
  {
    "mealPlanId": 1,
    "recipeIds": []
  }
  ```

- Recipe DB

```json
{
  "recipeId": 1,
  "recipeName": "chicken and waffles",
  "quantifiedIngredients": [
    {
      "ingredient": {
        "ingredientId": 1,
        "macros": {
          "protein": 1,
          "carbohydrates": 1,
          "fat": 1
        }
      },
      "quantity": {
        "unit": "millileters",
        "scalar": 1
      }
    }
  ],
  "instructions": [
    {
      "description": "boil water"
    }
  ]
}
```
