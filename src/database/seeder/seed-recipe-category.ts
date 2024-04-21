import { databaseClient } from "database";
import { logger } from "utils/log/logger.util";

export const seedRecipeCategory = async () => {
  for (const category of recipeCategories) {
    await databaseClient.category.upsert({
      where: {
        name: category
      },
      create: {
        name: category
      },
      update: {}
    });
    logger.info(`Category ${category} has been seeded.`);
  }
};

const recipeCategories = [
  "Appetizers",
  "Breakfast",
  "Brunch",
  "Lunch",
  "Dinner",
  "Desserts",
  "Beverages",
  "Soups",
  "Salads",
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Baked Goods",
  "Snacks",
  "Seafood",
  "Poultry",
  "Beef",
  "Pork",
  "Lamb",
  "Pasta",
  "Rice Dishes",
  "Slow Cooker",
  "Quick & Easy",
  "Healthy",
  "International Cuisine",
  "Holiday",
  "Sauces & Dressings",
  "Side Dishes",
  "Comfort Food",
  "BBQ & Grilling"
];
