import { z } from "zod";

export const recipeSchema = {
  createRecipeBody: z.object({
    body: z.object({
      data: z.object({
        recipe: z.object({
          title: z.string(),
          content: z.string(),
          images: z.array(z.string()),
          ingredientRecords: z
            .object({
              name: z.string(),
              quantity: z.string(),
              unit: z.string()
            })
            .array(),
          categoryName: z.string()
        })
      })
    })
  }),
  saveRecipe: z.object({
    body: z.object({
      data: z.object({
        recipeId: z.string()
      })
    })
  }),
  getRecipeById: z.object({
    query: z.object({
      id: z.string()
    })
  }),

  getPagingRecipes: z.object({
    query: z.object({
      page: z.string(),
      limit: z.string()
    })
  }),

  searchRecipeByHashTag: z.object({
    query: z.object({
      hashTag: z.string()
    })
  }),

  getRecipesByCategory: z.object({
    query: z.object({
      categoryName: z.string()
    })
  }),

  getRecipesByAuthor: z.object({
    query: z.object({
      authorId: z.string()
    })
  }),

  getRecipesBySavedUser: z.object({
    query: z.object({
      userId: z.string()
    })
  }),

  searchRecipe: z.object({
    query: z.object({
      searchString: z.string(),
      page: z.string(),
      limit: z.string(),
      ingredient: z.string().optional(),
      recipeCategory: z.string().optional()
    })
  }),

  getTotalRecipeCountByCategory: z.object({
    query: z.object({
      categoryName: z.string()
    })
  }),

  addCommentToRecipe: z.object({
    body: z.object({
      data: z.object({
        recipeId: z.string(),
        comment: z.string()
      })
    })
  }),

  complexSearch: z.object({
    query: z.object({
      query: z.string().optional(),
      cuisine: z.string().optional(),
      excludeCuisine: z.string().optional(),
      diet: z.string().optional(),
      intolerances: z.string().optional(),
      equipment: z.string().optional(),
      includeIngredients: z.string().optional(),
      excludeIngredients: z.string().optional(),
      type: z.string().optional(),
      instructionsRequired: z.boolean().optional(),
      fillIngredients: z.boolean().optional(),
      addRecipeInformation: z.boolean().optional(),
      titleMatch: z.string().optional(),
      maxReadyTime: z.string().optional(),
      ignorePantry: z.boolean().optional(),
      sort: z.string().optional(),
      sortDirection: z.string().optional(),
      minCarbs: z.string().optional(),
      maxCarbs: z.string().optional(),
      minProtein: z.string().optional(),
      maxProtein: z.string().optional(),
      minCalories: z.string().optional(),
      maxCalories: z.string().optional(),
      minFat: z.string().optional(),
      maxFat: z.string().optional()
    })
  }),
  getRecipeDetailsExternal: z.object({
    query: z.object({
      id: z.string()
    })
  }),
  createTypeOrIngredientBody: z.object({
    body: z.object({
      data: z.object({
        name: z.string(),
        type: z.string(),
        apiID: z.string()
      })
    })
  }),
  //importRecipeFromAPI: 
};

export type createTypeOrIngredient = z.infer<
  typeof recipeSchema.createTypeOrIngredientBody
>["body"];

export type createRecipe = z.infer<
  typeof recipeSchema.createRecipeBody
>["body"];

export type getRecipeById = z.infer<typeof recipeSchema.getRecipeById>["query"];

export type getPagingRecipes = z.infer<
  typeof recipeSchema.getPagingRecipes
>["query"];

export type searchRecipeByHashTag = z.infer<
  typeof recipeSchema.searchRecipeByHashTag
>["query"];

export type getRecipesByCategory = z.infer<
  typeof recipeSchema.getRecipesByCategory
>["query"];

export type getRecipesByAuthor = z.infer<
  typeof recipeSchema.getRecipesByAuthor
>["query"];

export type getRecipesBySavedUser = z.infer<
  typeof recipeSchema.getRecipesBySavedUser
>["query"];

export type searchRecipe = z.infer<typeof recipeSchema.searchRecipe>["query"];

export type getTotalRecipeCountByCategory = z.infer<
  typeof recipeSchema.getTotalRecipeCountByCategory
>["query"];

export type getComplexSearch = z.infer<
  typeof recipeSchema.complexSearch
>["query"];

export type getRecipeDetailsExternal = z.infer<
  typeof recipeSchema.getRecipeDetailsExternal
>["query"];

export type saveRecipe = z.infer<typeof recipeSchema.saveRecipe>["body"];
export type addCommentToRecipe = z.infer<
  typeof recipeSchema.addCommentToRecipe
>["body"];
