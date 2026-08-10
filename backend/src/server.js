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

// Connect to db
const db = new sqlite3.Database(
  path.join(__dirname, "../db/healthcover.db"),
  (err) => {
    if (err) {
      console.error(err.message);
      return;
    }
    console.log("connected to database");

    const initSqlPath = path.join(__dirname, "../db/init.sql");
    const initSql = fs.readFileSync(initSqlPath, "utf8");

    db.exec(initSql, (err) => {
      if (err) {
        console.error("error executing init.sql - ", err.message);
      } else {
        console.log(
          "Database initialized from init.sql",
        );
      }
    });
  },
);

app.locals.db = db;
app.use("/api/quotes", quotesRoutes);

app.listen(PORT, () => {
  console.log(`backend running on http://localhost:${PORT}`);
});
