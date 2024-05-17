import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config({ path: "./.env" });

const pool = new Pool({
  connectionString: `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`,
});

export default pool;