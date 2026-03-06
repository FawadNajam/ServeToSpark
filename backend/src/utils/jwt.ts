import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import type { RoleName } from "../types/enums";

export interface JwtPayload {
  sub: number;
  role: RoleName;
}

export function signToken(payload: JwtPayload): string {
  const options: SignOptions = {
    expiresIn: env.jwt.expiresIn as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, env.jwt.secret, options);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwt.secret) as unknown as JwtPayload;
}
