import { Router } from "express";
import { validate } from "middlewares/validate.middleware";
import { deserialize } from "middlewares/deserialize.middleware";
import { authenticate } from "middlewares/authenticate.middleware";
import { recipeSchema } from "./recipe.schema";
import { recipeController } from "./recipe.controller";

export const recipeRouter = Router();

recipeRouter.post(
  "/recipe/create",
  deserialize,
  authenticate,
  validate(recipeSchema.createRecipeBody),
  recipeController.createRecipe
);

recipeRouter.get(
  "/recipe/get",
  deserialize,
  authenticate,
  validate(recipeSchema.getRecipeById),
  recipeController.getRecipeById
);

recipeRouter.get(
  "/getPaginatedRecipes",
  deserialize,
  authenticate,
  validate(recipeSchema.getPagingRecipes),
  recipeController.getPaginatedRecipes
);

recipeRouter.get(
  "/searchRecipeByHashTag",
  deserialize,
  authenticate,
  validate(recipeSchema.searchRecipeByHashTag),
  recipeController.searchRecipeByHashTag
);

recipeRouter.get(
  "/getRecipesByCategory",
  deserialize,
  authenticate,
  validate(recipeSchema.getRecipesByCategory),
  recipeController.getRecipesByCategory
);

recipeRouter.get(
  "/getRecipesByAuthor",
  deserialize,
  authenticate,
  validate(recipeSchema.getRecipesByAuthor),
  recipeController.getRecipesByAuthor
);

recipeRouter.get(
  "/get-own-recipe",
  deserialize,
  authenticate,
  recipeController.getOwnRecipes
);

recipeRouter.get(
  "/get-user-saved-recipe",
  deserialize,
  authenticate,
  recipeController.getSavedRecipeOfUser
);

recipeRouter.get(
  "/getRecipesBySavedUser",
  deserialize,
  authenticate,
  validate(recipeSchema.getRecipesBySavedUser),
  recipeController.getRecipesBySavedUser
);

recipeRouter.get(
  "/searchRecipe",
  deserialize,
  authenticate,
  validate(recipeSchema.searchRecipe),
  recipeController.searchRecipe
);

recipeRouter.get(
  "/getTotalRecipeCountByCategory",
  deserialize,
  authenticate,
  validate(recipeSchema.getTotalRecipeCountByCategory),
  recipeController.getTotalRecipeCountByCategory
);

recipeRouter.get(
  "/complexSearch",
  deserialize,
  authenticate,
  validate(recipeSchema.complexSearch),
  recipeController.complexSearch
);

recipeRouter.get(
  "/getRecipeDetails/external",
  deserialize,
  authenticate,
  validate(recipeSchema.getRecipeDetailsExternal),
  recipeController.getRecipeDetailsExternal
);

recipeRouter.get("/ingredients", recipeController.getIngredientList);
recipeRouter.get("/categories", recipeController.getCategories);

recipeRouter.post(
  "/createTypeOrIngredient",
  deserialize,
  authenticate,
  validate(recipeSchema.createTypeOrIngredientBody),
  recipeController.createTypeOrIngredient
);

recipeRouter.post(
  "/recipe/save",
  deserialize,
  authenticate,
  validate(recipeSchema.saveRecipe),
  recipeController.saveRecipe
);

recipeRouter.post(
  "/recipe/comment",
  deserialize,
  authenticate,
  validate(recipeSchema.addCommentToRecipe),
  recipeController.addCommentToRecipe
);
