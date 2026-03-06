import dotenv from 'dotenv';

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT) || 4000,
  db: {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    name: process.env.DB_NAME ?? 'on_demand_service_db',
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? ''
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'change_me_in_production',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d'
  }
} as const;

