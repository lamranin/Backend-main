import { Router } from "express";
import { authController } from "./auth.controller";
import { RegisterBody, LoginBody } from "./auth.schema";
import { validate } from "middlewares/validate.middleware";
export const authRouter = Router();

authRouter.post("/login", authController.login);
authRouter.post("/register", authController.signUp);

// Export the router for use in your main server file
