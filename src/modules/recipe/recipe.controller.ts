import { Request, Response } from "express";
import { handleLibraryError } from "utils/error/error.util";
import {
  createRecipe,
  getPagingRecipes,
  getRecipeById,
  getRecipesByCategory,
  searchRecipeByHashTag,
  getRecipesByAuthor,
  getRecipesBySavedUser,
  searchRecipe,
  getTotalRecipeCountByCategory,
  getComplexSearch,
  getRecipeDetailsExternal,
  deleteRecipeParams,
  createTypeOrIngredient,
  saveRecipe,
  addCommentToRecipe,

} from "./recipe.schema";
import { recipeService } from "./recipe.service";
//importRecipeFromAPI
export const recipeController = {
  createRecipe: async (req: Request<{}, {}, createRecipe>, res: Response) => {
    try {
      const { recipe } = req.body.data;
      const newRecipe = await recipeService.createRecipe(
        recipe.title,
        recipe.content,
        recipe.images,
        res.locals.user.id,
        recipe.ingredientRecords,
        recipe.categoryName
      );
      return res.status(200).json({
        recipe: newRecipe
      });
    } catch (error) {
      return handleLibraryError(error, res);
    }
  },
  getRecipeById: async (
    req: Request<{}, {}, {}, getRecipeById>,
    res: Response
  ) => {
    try {
      const { id } = req.query;
      const recipe = await recipeService.getRecipeDetails(id);
      return res.status(200).json({
        recipe
      });
    } catch (error) {
      return handleLibraryError(error, res);
    }
  },

  getPaginatedRecipes: async (
    req: Request<{}, {}, {}, getPagingRecipes>,
    res: Response
  ) => {
    try {
      const { page, limit } = req.query;
      const recipes = await recipeService.getPagingRecipes(
        parseInt(page),
        parseInt(limit)
      );
      return res.status(200).json({
        recipes
      });
    } catch (error) {
      return handleLibraryError(error, res);
    }
  },

  searchRecipeByHashTag: async (
    req: Request<{}, {}, {}, searchRecipeByHashTag>,
    res: Response
  ) => {
    try {
      const { hashTag } = req.query;
      const recipes = await recipeService.searchRecipeByHashTag(hashTag);
      return res.status(200).json({
        recipes
      });
    } catch (error) {
      return handleLibraryError(error, res);
    }
  },

  getRecipesByCategory: async (
    req: Request<{}, {}, {}, getRecipesByCategory>,
    res: Response
  ) => {
    try {
      const { categoryName } = req.query;
      const recipes = await recipeService.getRecipesByCategory(categoryName);
      return res.status(200).json({
        recipes
      });
    } catch (error) {
      return handleLibraryError(error, res);
    }
  },
  getRecipesByAuthor: async (
    req: Request<{}, {}, {}, getRecipesByAuthor>,
    res: Response
  ) => {
    try {
      const { authorId } = req.query;
      const recipes = await recipeService.getRecipesByAuthor(authorId);
      return res.status(200).json({
        recipes
      });
    } catch (error) {
      return handleLibraryError(error, res);
    }
  },

  getOwnRecipes: async (req: Request<{}, {}, {}>, res: Response) => {
    try {
      const { id } = res.locals.user;
      if (id) {
        const recipes = await recipeService.getRecipesByAuthor(id);
        return res.status(200).json({
          recipes
        });
      } else {
        return res.status(401).json({ message: "User not found" });
      }
    } catch (error) {
      return handleLibraryError(error, res);
    }
  },

  getSavedRecipeOfUser: async (req: Request<{}, {}, {}>, res: Response) => {
    try {
      const { id } = res.locals.user;

      if (id) {
        const recipes = await recipeService.getRecipesBySavedUser(id);
        return res.status(200).json({
          recipes
        });
      } else {
        return res.status(401).json({ message: "User not found" });
      }
    } catch (error) {
      return handleLibraryError(error, res);
    }
  },

  getRecipesBySavedUser: async (
    req: Request<{}, {}, {}, getRecipesBySavedUser>,
    res: Response
  ) => {
    try {
      const { userId } = req.query;
      const recipes = await recipeService.getRecipesBySavedUser(userId);
      return res.status(200).json({
        recipes
      });
    } catch (error) {
      return handleLibraryError(error, res);
    }
  },

  searchRecipe: async (
    req: Request<{}, {}, {}, searchRecipe>,
    res: Response
  ) => {
    try {
      const { searchString, page, limit, ingredient, recipeCategory } =
        req.query;

      const recipes = await recipeService.searchRecipe(
        searchString,
        parseInt(page),
        parseInt(limit),
        ingredient,
        recipeCategory
      );
      return res.status(200).json({
        recipes
      });
    } catch (error) {
      return handleLibraryError(error, res);
    }
  },

  getTotalRecipeCountByCategory: async (
    req: Request<{}, {}, {}, getTotalRecipeCountByCategory>,
    res: Response
  ) => {
    try {
      const { categoryName } = req.query;
      const count = await recipeService.getTotalRecipeCountByCategory(
        categoryName
      );
      return res.status(200).json({
        count
      });
    } catch (error) {
      return handleLibraryError(error, res);
    }
  },

  deleteRecipe: async (req: Request<{}, {}, {}, deleteRecipeParams>,
    res: Response) => {
    try {
      // Validate the request parameters
      const params = req.query;
      const result = await recipeService.deleteRecipe(params.recipeId);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({ error: error.message });
      }
      console.error("Server Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  
  
  
  complexSearch: async (
    req: Request<{}, {}, {}, getComplexSearch>,
    res: Response
  ) => {
    try {
      const { query } = req.query;
      const recipes = await recipeService.complexSearch(query);
      return res.status(200).json({
        recipes
      });
    } catch (error) {
      return handleLibraryError(error, res);
    }
  },

  getRecipeDetailsExternal: async (
    req: Request<{}, {}, {}, getRecipeDetailsExternal>,
    res: Response
  ) => {
    try {
      const { id } = req.query;
      const recipe = await recipeService.getRecipeDetails(id);
      return res.status(200).json({
        recipe
      });
    } catch (error) {
      return handleLibraryError(error, res);
    }
  },
  getIngredientList: async (req: Request, res: Response) => {
    try {
      const ingredientList = await recipeService.getIngredients();
      return res.status(200).json({
        ingredientList
      });
    } catch (error) {
      return handleLibraryError(error, res);
    }
  },
  getCategories: async (req: Request, res: Response) => {
    try {
      const categories = await recipeService.getRecipeTypes();
      return res.status(200).json({
        categories
      });
    } catch (error) {
      return handleLibraryError(error, res);
    }
  },
  createTypeOrIngredient: async (
    req: Request<{}, {}, createTypeOrIngredient>,
    res: Response
  ) => {
    try {
      const { data } = req.body;
      let result;
      if (data.type === "ingredient") {
        result = await recipeService.createIngredient(data.name);
      }
      if (data.type === "category") {
        result = await recipeService.createType(data.name);
      }
      return res.status(200).json({
        result
      });
    } catch (error) {
      return handleLibraryError(error, res);
    }
  },
  saveRecipe: async (req: Request<{}, {}, saveRecipe>, res: Response) => {
    try {
      const { id } = res.locals.user;
      const { recipeId } = req.body.data;
      if (id) {
        const result = await recipeService.saveRecipe(id, recipeId);
        return res.status(200).json({
          result
        });
      } else {
        return res.status(401).json({ message: "User not found" });
      }
    } catch (error) {
      return handleLibraryError(error, res);
    }
  },
  addCommentToRecipe: async (
    req: Request<{}, {}, addCommentToRecipe>,
    res: Response
  ) => {
    const { data } = req.body;
    const { user } = res.locals;

    try {
      if (!user) return res.status(401).json({ message: "User not found" });
      const result = await recipeService.addCommentToRecipe(
        data.comment,
        data.recipeId,
        user.id
      );
      return res.status(200).json({
        result
      });
    } catch (error) {
      return handleLibraryError(error, res);
    }
  },/*
    importRecipe : async (req: Request, res: Response) => {
    const { recipeId } = req.params; // Assuming recipeId is passed as a URL parameter
    try {
      const recipe = await importRecipeFromAPI(recipeId);
      res.status(200).json({
        message: "Recipe imported successfully",
        recipe
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
  */
};
