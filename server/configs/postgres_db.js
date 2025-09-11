// configs/postgres_db.js
import pg from "pg";

const { Pool } = pg;
import dotenv from "dotenv";
dotenv.config();
/*const pool = new Pool({
  user: process.env.POSTGRES_DB_USER,
  host: process.env.POSTGRES_DB_HOST,
  database: process.env.POSTGRES_DB_NAME,
  password: process.env.POSTGRES_DB_PASSWORD,
  port: process.env.POSTGRES_DB_PORT,
});*/
const pool = new Pool({
  connectionString: process.env.POSTGRES_DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required for Render
});
export default pool;
