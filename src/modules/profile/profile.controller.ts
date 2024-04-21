import { Request, Response } from "express";
import { profileService } from "./profile.service";
import { ProfileUpdateBodyType } from "./profile.schema";

export const profileController = {
  async getProfile(req: Request, res: Response) {
    try {
      // Get the user from the request object
      const user = res.locals.user;
      if (user) {
        const profileData = await profileService.getProfile(user.id);
        return res.status(200).json({ profileData });
      } else {
        return res.status(401).json({ message: "User not found" });
      }
    } catch (error) {
      const message = (error as Error).message;
      res.status(400).json({ message });
    }
  },

  updateProfile: async (
    req: Request<{}, {}, ProfileUpdateBodyType>,
    res: Response
  ) => {
    try {
      const user = res.locals.user;
      if (res.locals.user) {
        const updatedProfile = await profileService.updateProfile(
          user.id,
          req.body
        );
        return res.status(200).json({ updatedProfile });
      } else {
        return res.status(401).json({ message: "User not found" });
      }
    } catch (error) {
      const message = (error as Error).message;
      res.status(400).json({ message });
    }
  }
};
