import type { RoleName } from './enums';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: number;
      role: RoleName;
    };
  }
}

