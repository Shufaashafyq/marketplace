import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

const jwtSecret: string = JWT_SECRET;

export type AuthTokenPayload = {
  userId: string;
  role: "USER" | "ADMIN";
};

export function createAuthToken(payload: AuthTokenPayload) {
  return jwt.sign(payload, jwtSecret, {
    expiresIn: "7d",
  });
}

export function verifyAuthToken(token: string) {
  return jwt.verify(token, jwtSecret) as AuthTokenPayload;
}