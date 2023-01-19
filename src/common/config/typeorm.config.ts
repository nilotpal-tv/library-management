import { registerAs } from '@nestjs/config';

export default registerAs('typeormConfig', () => ({
  DB_NAME: process.env.DB_NAME,
  DB_TYPE: process.env.DB_TYPE,
  DB_HOST: process.env.DB_HOST,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_PORT: Number(process.env.DB_PORT),
}));
