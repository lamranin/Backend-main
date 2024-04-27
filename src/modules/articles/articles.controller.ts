import { Request, Response } from 'express';
import {articleService} from './articles.service'
import { CreateArticleInput, GetArticles } from './articles.schema';
import { handleLibraryError } from "utils/error/error.util";

export const createArticle = async (req: Request<{}, {},  CreateArticleInput >, res: Response) => {
  try {
    const { article } = req.body.data;
    const newArticle = await articleService.createArticle(
      article.title,
      article.content,
      article.userId,
      article.recipeId
    );
    return res.status(200).json({
      article: newArticle
    });
  } catch (error) {
    console.log("here we go");
    return handleLibraryError(error, res);
  }
};

export const getArticlesByUserId = async (req: Request<{}, {}, {}, GetArticles>,
  res: Response) => {
  
  try {
    const {id} = req.query;
    const articles = await articleService.getArticlesByUserId(id);
    return res.status(200).json({articles});
  } catch (error) {
    return handleLibraryError(error, res);
  }
};

export const getAllArticles = async (req: Request<{}, {}, {}>,
  res: Response) => {
  
  try {
    
    const articles = await articleService.getAllArticles();
    return res.status(200).json({articles});
  } catch (error) {
    return handleLibraryError(error, res);
  }
};

