const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
require("dotenv").config();

async function ready() {
  const db = await open({
    filename: process.env.SQLITE_DB_PATH,
    driver: sqlite3.Database,
  });
  return db;
}
module.exports = { isReady: ready() };
