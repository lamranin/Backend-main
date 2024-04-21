import { Request, Response } from "express";
import { authService } from "./auth.service";
import { LoginBodyType, RegisterBodyType } from "./auth.schema";
import { signAccessToken } from "utils/auth/jwt.util";

export const authController = {
  async login(req: Request<{}, {}, LoginBodyType>, res: Response) {
    try {
      const user = await authService.login(req.body.email, req.body.password);
      if (user) {
        const accessTokenContent = {
          id: user.id
        };
        const accessToken = signAccessToken(accessTokenContent);
        return res.status(200).json({
          accessToken,
          userId: user.id
        });
      } else {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      const message = (error as Error).message;
      res.status(400).json({ message });
    }
  },

  async signUp(
    req: Request<{}, {}, { data: RegisterBodyType }>,
    res: Response
  ) {
    try {
      const newUser = await authService.signUp(req.body.data);
      res.status(201).json(newUser);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  }
};
