declare module 'express-serve-static-core' {
  interface Request {
    user: User;
  }
}

declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      NODE_ENV: 'development' | 'test' | 'production';
      MONGO_URI: string;
      ACCESS_TOKEN_SECRET: string;
      REFRESH_TOKEN_SECRET: string;
    }
  }
}

export {};
