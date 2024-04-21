import { NextFunction, Request, Response } from "express";
import { verifyToken } from "utils/auth/jwt.util";
import { handleClientError } from "utils/error/error.util";

export const deserialize = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = (req.headers.authorization ?? "").replace(
    /^Bearer\s/,
    ""
  );

  const locationId = req.headers["request-location-id"] ?? "";

  // Verify token and deserialize user object in res.locals
  if (accessToken) {
    const decodedToken = verifyToken(accessToken);

    res.locals.user = decodedToken;
    res.locals.locationId = locationId;

    return next();
  }

  // Error
  return handleClientError(
    401,
    "Please register or login to access this route.",
    res
  );
};
