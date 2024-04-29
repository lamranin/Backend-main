import { databaseClient } from "../../database";
import axios from "axios";
export const recipeService = {
  extractHashTagsFromString: (string: string) => {
    const hashTags = string.match(/#[a-z]+/g);
    return hashTags;
  },

  createRecipe: async (
    
    title: string,
    content: string,
    images: string[],
    authorId: string,
    ingredientRecords: {
      name: string;
      quantity: string;
      unit: string;
    }[],
    categoryName: string
  ) => {
    const parsedHashTags = recipeService.extractHashTagsFromString(content);

    const recipe = await databaseClient.recipe.create({
      data: {
        title,
        content,
        authorId,
        categoryName
      }
    });
    if (!recipe) return null;
    for (const ingredientRecord of ingredientRecords) {
      await databaseClient.ingredientRecord.create({
        data: {
          recipeId: recipe.id,
          ingredientName: ingredientRecord.name,
          quantity: ingredientRecord.quantity,
          unit: ingredientRecord.unit
        }
      });
    }

    for (const image of images) {
      await databaseClient.recipeImage.create({
        data: {
          imageUrl: image,
          recipeId: recipe.id,
          Recipe: {
            connect: {
              id: recipe.id
            }
          }
        }
      });
    }
    if (parsedHashTags)
      for (const hashTag of parsedHashTags) {
        await databaseClient.hashtag.create({
          data: {
            name: hashTag,
            recipes: {
              connect: {
                id: recipe.id
              }
            }
          }
        });
      }

    const newRecipe = await databaseClient.recipe.findUnique({
      where: {
        id: recipe.id
      },
      include: {
        hashtags: true,
        category: true,
        ingredientRecords: true
      }
    });
    return {
      ...newRecipe,
      ingredientRecords: newRecipe?.ingredientRecords
        ? newRecipe.ingredientRecords.map((ingredient) => ({
            ...ingredient,
            quantity: parseFloat(ingredient.quantity)
          }))
        : []
    };
  },

  getRecipeDetails: async (recipeId: string) => {
    const recipe = await databaseClient.recipe.findUnique({
      where: {
        id: recipeId
      },
      include: {
        hashtags: true,
        category: true,
        ingredientRecords: {
          include: {
            ingredient: true
          }
        },
        comments: {
          include: {
            user: {
              select: {
                person: true
              }
            }
          }
        },
        savedByUsers: true,
        images: true,
        author: {
          select: {
            person: true
          }
        }
      }
    });
    return recipe;
  },

  getPagingRecipes: async (page: number, limit: number) => {
    const recipes = await databaseClient.recipe.findMany({
      skip: (page - 1) * limit,
      take: limit,
      include: {
        hashtags: true,
        category: true,
        ingredientRecords: true,
        comments: true,
        savedByUsers: true,
        images: true,
        author: {
          include: {
            person: true
          }
        }
      }
    });
    return recipes;
  },

  searchRecipeByHashTag: async (hashTag: string) => {
    const recipes = await databaseClient.recipe.findMany({
      where: {
        hashtags: {
          some: {
            name: hashTag
          }
        }
      },
      include: {
        hashtags: true,
        category: true,
        ingredientRecords: true,
        comments: true,
        savedByUsers: true,
        author: {
          select: {
            username: true,
            id: true
          }
        }
      }
    });
    return recipes;
  },

  getRecipesByCategory: async (categoryName: string) => {
    const recipes = await databaseClient.recipe.findMany({
      where: {
        categoryName
      },
      include: {
        hashtags: true,
        category: true,
        ingredientRecords: true,
        comments: true,
        savedByUsers: true,
        author: {
          select: {
            username: true,
            id: true
          }
        }
      }
    });
    return recipes;
  },

  getRecipesByAuthor: async (authorId: string) => {
    const recipes = await databaseClient.recipe.findMany({
      where: {
        authorId
      },
      include: {
        hashtags: true,
        category: true,
        ingredientRecords: true,
        comments: true,
        savedByUsers: true,
        author: {
          select: {
            username: true,
            id: true
          }
        },
        images: true
      }
    });
    return recipes;
  },

  getRecipesBySavedUser: async (userId: string) => {
    console.log(userId);
    const recipes = await databaseClient.recipe.findMany({
      where: {
        savedByUsers: {
          some: {
            userId: userId
          }
        }
      },
      include: {
        hashtags: true,
        category: true,
        ingredientRecords: true,
        comments: true,
        savedByUsers: true,
        author: {
          select: {
            username: true,
            id: true
          }
        },
        images: true
      }
    });
    return recipes;
  },

  searchRecipe: async (
    searchString: string,
    page: number,
    limit: number,
    ingredient?: string,
    recipeCategory?: string
  ) => {
    console.log(searchString, page, limit, ingredient, recipeCategory);

    let whereConditions: any = {};

    if (searchString !== "all") {
      whereConditions.OR = [
        { title: { contains: searchString, mode: "insensitive" } },
        {
          author: { username: { contains: searchString, mode: "insensitive" } }
        },
        {
          hashtags: {
            some: { name: { contains: searchString, mode: "insensitive" } }
          }
        }
      ];
    }

    if (ingredient) {
      whereConditions = {
        ...whereConditions,
        ingredientRecords: {
          some: {
            ingredient: {
              name: { contains: ingredient, mode: "insensitive" }
            }
          }
        }
      };
    }

    if (recipeCategory) {
      whereConditions = {
        ...whereConditions,
        category: {
          name: { contains: recipeCategory, mode: "insensitive" }
        }
      };
    }

    const recipes = await databaseClient.recipe.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: whereConditions,
      include: {
        hashtags: true,
        category: true,
        ingredientRecords: {
          include: {
            ingredient: true
          }
        },
        comments: true,
        savedByUsers: true,
        author: {
          select: {
            username: true,
            id: true,
            person: true
          }
        },
        images: true
      }
    });

    return recipes;
  },

  getTotalRecipeCount: async () => {
    const count = await databaseClient.recipe.count();
    return count;
  },

  getTotalRecipeCountByCategory: async (categoryName: string) => {
    const count = await databaseClient.recipe.count({
      where: {
        categoryName
      }
    });
    return count;
  },

  complexSearch: async (searchParams: any) => {
    const options = {
      method: "GET",
      url: "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch",
      params: searchParams,
      headers: {
        "X-RapidAPI-Key": process.env.SPOONACULAR_API_KEY,
        "X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com"
      }
    };
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Error occurred while fetching recipes");
    }
  },

  getRecipeInformation: async (recipeId: string) => {
    const options = {
      method: "GET",
      url: `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${recipeId}/information`,
      headers: {
        "X-RapidAPI-Key": process.env.SPOONACULAR_API_KEY, // Use an environment variable for the API key
        "X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com"
      }
    };

    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Error occurred while fetching recipe information");
    }
  },
  getIngredients: async () => {
    return await databaseClient.ingredient.findMany();
  },
  getRecipeTypes: async () => {
    return await databaseClient.category.findMany();
  },
  createIngredient: async (name: string) => {
    return await databaseClient.ingredient.create({
      data: {
        name
      }
    });
  },
  createType: async (name: string) => {
    return await databaseClient.category.create({
      data: {
        name
      }
    });
  },
  saveRecipe: async (userId: string, recipeId: string) => {
    const existingSavedRecipe = await databaseClient.savedRecipe.findFirst({
      where: {
        userId,
        recipeId
      }
    });
    if (existingSavedRecipe) {
      await databaseClient.savedRecipe.delete({
        where: {
          id: existingSavedRecipe.id
        }
      });
      return existingSavedRecipe;
    }
    return await databaseClient.savedRecipe.create({
      data: {
        user: {
          connect: {
            id: userId
          }
        },
        recipe: {
          connect: {
            id: recipeId
          }
        }
      }
    });
  },

  addCommentToRecipe: async (
    comment: string,
    recipeId: string,
    userId: string
  ) => {
    return await databaseClient.comment.create({
      data: {
        text: comment,
        recipe: {
          connect: {
            id: recipeId
          }
        },
        user: {
          connect: {
            id: userId
          }
        }
      }
    });
  },
  /*
  importRecipeFromAPI : async (recipeId: string) => {
    const url = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${recipeId}/information`;
    try {
      const response = await axios.get(url, {
        headers: {
          "X-RapidAPI-Key": process.env.SPOONACULAR_API_KEY,
          "X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com"
        }
      });
  
      const recipeData = response.data;
  
      // Convert API recipe format to your database format if necessary
      const newRecipe = {
        title: recipeData.title,
        content: recipeData.summary, // Consider stripping HTML tags if necessary
        images: [recipeData.image],
        authorId: "system", // Assuming 'system' or a designated ID if automated
        ingredientRecords: recipeData.extendedIngredients.map(ing => ({
          name: ing.name,
          quantity: ing.amount.toString(),
          unit: ing.unit
        })),
        categoryName: recipeData.dishTypes[0] || "General", // Default category if not specified
      };
  
      // Use existing service method to create recipe
      return await recipeService.createRecipe(
        newRecipe.title,
        newRecipe.content,
        newRecipe.images,
        newRecipe.authorId,
        newRecipe.ingredientRecords,
        newRecipe.categoryName
      );
  
    } catch (error) {
      console.error("Failed to import recipe from API:", error);
      throw new Error("Error occurred while importing recipe from API");
    }
  }
  */
};

