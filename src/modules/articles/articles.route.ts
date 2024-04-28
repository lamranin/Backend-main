import express from 'express';
import { validate } from "middlewares/validate.middleware";
import { deserialize } from "middlewares/deserialize.middleware";
import { authenticate } from "middlewares/authenticate.middleware";
import {createArticle, getArticlesByUserId, getAllArticles} from './articles.controller';
import { createArticleSchema } from './articles.schema';

export const articleRouter = express.Router();

articleRouter.post(
    "/article/create",
    deserialize,
    authenticate,
    validate(createArticleSchema.newArticle),
    createArticle
  );

articleRouter.get('/article/get', getArticlesByUserId);

articleRouter.get('/article/all',
deserialize,
authenticate,
getAllArticles
);

