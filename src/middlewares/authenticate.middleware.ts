import { AccessTokenType } from "utils/auth/jwt.util";
import { NextFunction, Request, Response } from "express";
import { authService } from "modules/auth/auth.service";

import { handleClientError, handleLibraryError } from "utils/error/error.util";
import { User } from "@prisma/client";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user: AccessTokenType = res.locals.user;
  if (!user) {
    return handleClientError(401, "Please login to access this route.", res);
  }

  let foundUser: User | null = null;

  try {
    foundUser = await authService.findUserById(user.id);
  } catch (error) {
    return handleLibraryError(error, res);
  }

  if (!foundUser) {
    return handleClientError(401, "Please login to access this route.", res);
  }
  if (foundUser) {
    return next();
  } else {
    return handleClientError(401, "Please login to access this route.", res);
  }
};
