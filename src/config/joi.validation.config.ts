import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  // postgres related environment variables
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USERNAME: Joi.string().required(),

  // application related environment variables
  PORT: Joi.number().default(3000),
});
