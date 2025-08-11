import * as dotenv from 'dotenv';
dotenv.config({ path: `${process.cwd()}/.env` });
console.log(process.env.NODE_ENV);

export default () => {
  return {
    NODE_ENV: process.env.NODE_ENV,
    port: process.env.APP_PORT,
    env: String(process.env.APP_ENV),
    frontUrl: process.env.FRONT_URL,
    jwtSecret: process.env.JWT_SECRET,
  };
};
