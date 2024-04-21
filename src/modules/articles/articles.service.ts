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
          userId,
          recipeId
          
        }
      });

      return article;
    } catch (error) {
      console.error("Failed to create article from the service side:", error);
      return Error("Error occurred while creating article");
    }
  },
  getArticlesByUserId: async (userId: string) => {
  const articles = await databaseClient.article.findMany({
    where: { userId },
    include: { recipe: true },
  });
  return articles;
}
};