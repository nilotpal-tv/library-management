import { registerAs } from '@nestjs/config';

export default registerAs('jwtConfig', () => ({
  JWT_TOKEN_ISSUER: process.env.JWT_TOKEN_ISSUER,
  JWT_TOKEN_AUDIENCE: process.env.JWT_TOKEN_AUDIENCE,
  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
  JWT_ACCESS_TOKEN_TTL: Number(process.env.JWT_ACCESS_TOKEN_TTL),
  JWT_REFRESH_TOKEN_TTL: Number(process.env.JWT_REFRESH_TOKEN_TTL),
}));
