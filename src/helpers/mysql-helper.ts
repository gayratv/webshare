import './dotenv-init.js';
import mysql from 'mysql2/promise';

let pool: mysql.Pool;
export function createConnectionA() {
  if (!pool) {
    pool = mysql.createPool({
      port: parseInt(process.env.MYSQL_PORT),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DBNAME,
      host: process.env.MYSQL_HOST,
      namedPlaceholders: true,
      // debug: true,
    });
  }

  return pool;
}

export async function destroyPool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
