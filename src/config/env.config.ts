export const EnvConfiguration = () => ({
  NODE_ENV: process.env.NODE_ENV || 'dev',
  postgres: {
    dbName: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
  },

  port: parseInt(process.env.PORT, 10) || 3000,
});
