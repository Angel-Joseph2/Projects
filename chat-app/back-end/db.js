const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

let db;

async function connectDB() {
  db = await open({
    filename: "./chat.db",
    driver: sqlite3.Database,
  });

  console.log("✅ SQLite Connected");

  return db;
}

module.exports = connectDB;