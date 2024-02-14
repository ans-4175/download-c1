import { open } from "sqlite";
import sqlite3 from "sqlite3";
import "dotenv/config";

async function ready() {
  const db = await open({
    filename: process.env.SQLITE_DB_PATH,
    driver: sqlite3.Database,
  });
  return db;
}
export const isReady = ready();
