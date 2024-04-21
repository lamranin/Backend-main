import { Router } from "express";
import { profileController } from "./profile.controller";
import { authenticate } from "middlewares/authenticate.middleware";
import { deserialize } from "middlewares/deserialize.middleware";

export const profileRouter = Router();

profileRouter.get(
  "/user-profile",
  deserialize,
  authenticate,
  profileController.getProfile
);

profileRouter.put(
  "/update-profile",
  deserialize,
  authenticate,
  profileController.updateProfile
);
