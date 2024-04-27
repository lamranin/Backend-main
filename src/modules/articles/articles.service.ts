import { PrismaClient } from '@prisma/client';
import { CreateArticleInput } from './articles.schema';
import { databaseClient } from "database";
const prisma = new PrismaClient();

export const articleService = {
  
  createArticle: async (
    title: string,
    content: string,
    userId: string,
    recipeId: string
  ) => {
    try {
      const article = await databaseClient.article.create({
        data: {
          title,
          content,
          user: {
            connect: {
              id:userId
            }
          },
          recipe: {
            connect: {
              id: recipeId
            }
          }
        }
      });

      return article;
    } catch (error) {
      console.error("Failed to create article:", error);
      return Error("Error occurred while creating article");
    }
  },
  getArticlesByUserId: async (userId: string) => {
  const articles = await databaseClient.article.findMany({
    where: { userId },
    include: { recipe: true },
  });
  return articles;
},
getAllArticles: async () => {
  try {
    // Fetch all articles from the database
    const articles = await databaseClient.article.findMany({
      include: {
        recipe: true, // Assuming there is a relation with a recipe
      }
    });
    return articles;
  } catch (error) {
    console.error("Failed to retrieve articles:", error);
    throw new Error("Error occurred while fetching articles");
  }
}
};