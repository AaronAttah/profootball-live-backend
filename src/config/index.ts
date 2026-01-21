export const appConfig = {
  port: Number(process.env.PORT || 3000),
};

export const dbConfig = {
  url: process.env.DATABASE_URL as string,
  host: process.env.DB_HOST as string,
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME as string,
  username: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
};

export const jwtConfig = {
  secret: process.env.JWT_SECRET as string,
  expiresIn: process.env.JWT_EXPIRES_IN || '1d',
};



