const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// SQLite setup
const dbPath = path.resolve(__dirname, 'timelapse.db');
const db = new sqlite3.Database(dbPath);

// Create logs table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT NOT NULL,
      activity TEXT NOT NULL,
      reason TEXT
    )
  `);
});

// Routes

// Get all logs (optionally by date)
app.get('/logs', (req, res) => {
  const date = req.query.date; // YYYY-MM-DD
  let query = "SELECT * FROM logs";
  let params = [];
  if (date) {
    query += " WHERE DATE(timestamp) = ?";
    params.push(date);
  }
  query += " ORDER BY timestamp DESC";
  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Add a new log
app.post('/logs', (req, res) => {
  const { activity, reason, timestamp } = req.body;
  if (!activity || !timestamp) {
    return res.status(400).json({ error: "Activity and timestamp are required." });
  }
  db.run(
    "INSERT INTO logs (timestamp, activity, reason) VALUES (?, ?, ?)",
    [timestamp, activity, reason || ""],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// Simple health check
app.get('/', (req, res) => {
  res.send("Timelapse backend is running!");
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});