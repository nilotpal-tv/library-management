import { TypeOrmModuleOptions } from '@nestjs/typeorm';

declare namespace NodeJS {
  interface ProcessEnv {
    readonly DB_PORT: number;
    readonly DB_HOST: string;
    readonly DB_NAME: string;
    readonly DB_PASSWORD: string;
    readonly DB_USERNAME: string;
    readonly JWT_TOKEN_ISSUER: string;
    readonly JWT_TOKEN_AUDIENCE: string;
    readonly JWT_ACCESS_TOKEN_TTL: number;
    readonly JWT_REFRESH_TOKEN_TTL: number;
    readonly JWT_ACCESS_TOKEN_SECRET: string;
    readonly JWT_REFRESH_TOKEN_SECRET: string;
    readonly DB_TYPE: TypeOrmModuleOptions['type'];
    readonly NODE_ENV: 'development' | 'production' | 'test';
  }
}
