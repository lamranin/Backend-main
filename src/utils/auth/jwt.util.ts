import { sign, verify } from "jsonwebtoken";
import { env } from "config";

export interface AccessTokenType {
  id: string;
}

export const signAccessToken = (user: AccessTokenType) => {
  let payload = user;
  const accessToken = signToken(payload);
  return accessToken;
};

const signToken = (token: object) => {
  const privateKey = <string>env.accessKey;

  const signedToken = sign(token, privateKey, {
    algorithm: "HS256",
    expiresIn: "1d"
  });

  return signedToken;
};

export const verifyToken = (token: string): AccessTokenType | null => {
  const publicKey = <string>env.accessKey;

  try {
    const decodedToken = verify(token, publicKey) as AccessTokenType;
    return decodedToken;
  } catch (error) {
    return null;
  }
};
