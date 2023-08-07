declare module 'express-serve-static-core' {
  interface Request {
    user: string;
  }
}

declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      NODE_ENV: 'development' | 'test';
      MONGO_URI: string;
    }
  }
}

export {};
