import cors from "cors";
import express, { Request, Response } from "express";
import morganBody from "morgan-body";
import { handleClientError } from "./utils/error/error.util";
import { getRequestLogger } from "./utils/log";

import { env } from "./config";
import { httpLogger } from "utils/log/http-logger.util";
import { authRouter } from "modules/auth/auth.route";
import { recipeRouter } from "modules/recipe/recipe.route";
import { profileRouter } from "modules/profile/profile.route";
import { articleRouter } from "modules/articles/articles.route";

// Initialization
const app = express();

// Configuration
app.set("port", env.port);

// Middlewares
app.use(
  cors({
    origin: [env.clientUrl, "http://localhost:3000"],
    credentials: true
  })
);

app.use(express.json({ limit: "16mb" }));
app.use(express.urlencoded({ extended: false }));

// HTTP loggers
morganBody(app, {
  logReqDateTime: false,
  logReqUserAgent: false,
  logIP: false,
  maxBodyLength: 1024
});
app.use(httpLogger);
app.use(getRequestLogger());

app.use(authRouter);
app.use(recipeRouter);
app.use(profileRouter);
app.use(articleRouter);
// Routes

app.get("/are-you-ok", (req: Request, res: Response) => {
  return res.status(200).send("Yeah, I am OK.");
});

app.use("*", (req: Request, res: Response) => {
  return handleClientError(404, "Unknown request path", res);
});

export default app;
