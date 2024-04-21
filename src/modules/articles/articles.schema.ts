import { z } from 'zod';

export const createArticleSchema = {
  newArticle: z.object({
    body: z.object({
      data: z.object({
        article: z.object({
          title: z.string(),
          content: z.string(),
          userId: z.string(),
          recipeId: z.string(),
        })
      })
    })
  }),
  getArticleByID: z.object({
    query: z.object({
      id: z.string()
    })
  }),
};


export type CreateArticleInput = z.infer<typeof createArticleSchema.newArticle>['body'];

export type GetArticles = z.infer<typeof createArticleSchema.getArticleByID>["query"];