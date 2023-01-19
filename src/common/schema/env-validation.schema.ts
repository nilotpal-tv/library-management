import * as yup from 'yup';

export const EnvironmentValidationSchema = yup.object({
  JWT_TOKEN_ISSUER: yup.string().required(),
  JWT_TOKEN_AUDIENCE: yup.string().required(),
  JWT_ACCESS_TOKEN_TTL: yup.number().required(),
  JWT_REFRESH_TOKEN_TTL: yup.number().required(),
  JWT_ACCESS_TOKEN_SECRET: yup.string().required(),
  JWT_REFRESH_TOKEN_SECRET: yup.string().required(),
});
