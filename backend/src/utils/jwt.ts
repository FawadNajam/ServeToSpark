import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import type { RoleName } from '../types/enums';

export interface JwtPayload {
  sub: number;
  role: RoleName;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn
  });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwt.secret) as JwtPayload;
}

