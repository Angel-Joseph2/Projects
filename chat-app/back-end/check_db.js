const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

async function check() {
  const db = await open({
    filename: "./chat.db",
    driver: sqlite3.Database,
  });

  const tables = await db.all("SELECT name, sql FROM sqlite_master WHERE type='table'");
  console.log(JSON.stringify(tables, null, 2));
}

check();
