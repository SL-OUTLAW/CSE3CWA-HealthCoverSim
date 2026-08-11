// backend/src/server.js
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const quotesRoutes = require("./routes/quotes");

const PORT = 5678;
const app = express();

app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, "../db/healthcover.db");
const dbExists = fs.existsSync(dbPath);

// Connect to db
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("DB Error: ", err.message);
    return;
  }
  console.log("Created SQLite database connection");

  if (!dbExists) {
    console.log("Database file not found. Initializing schema from init.sql");
    try {
      const initSqlPath = path.join(__dirname, "../db/init.sql");
      const initSql = fs.readFileSync(initSqlPath, "utf8");

      db.exec(initSql, (execErr) => {
        if (execErr) {
          console.error("Error executing init.sql:", execErr.message);
        } else {
          console.log("Database initialized from init.sql");
        }
      });
    } catch (fileErr) {
      console.error("Error reading init.sql: ", fileErr.message);
    }
  } else {
    console.log("Database exists, Skipping init.sql");
  }
});

app.locals.db = db;
app.use("/api/quotes", quotesRoutes);

app.listen(PORT, () => {
  console.log(`backend running on http://localhost:${PORT}`);
});
