import { seedIngredients } from "./seed-ingredients";
import { seedRecipe } from "./seed-recipe";
import { seedRecipeCategory } from "./seed-recipe-category";

export const seedDatabase = async () => {
  await seedIngredients();
  await seedRecipeCategory();
  //await seedRecipe();
  // uncomment the above line aa
};
