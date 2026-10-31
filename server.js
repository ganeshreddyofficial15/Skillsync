const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database Setup
const dbFile = path.join(__dirname, 'skillsync.db');
const db = new sqlite3.Database(dbFile, (err) => {
    if (err) console.error('Error opening database', err.message);
    else console.log('Connected to the SQLite database.');
});

// Initialize Tables
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        skills TEXT NOT NULL,
        bio TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        event_name TEXT NOT NULL,
        required_skills TEXT NOT NULL,
        leader_name TEXT NOT NULL
    )`);
});

// API: Get all projects
app.api_projects = app.get('/api/projects', (req, res) => {
    db.all(`SELECT * FROM projects`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// API: Post a new project
app.post('/api/projects', (req, res) => {
    const { title, description, event_name, required_skills, leader_name } = req.body;
    const query = `INSERT INTO projects (title, description, event_name, required_skills, leader_name) VALUES (?, ?, ?, ?, ?)`;
    db.run(query, [title, description, event_name, required_skills, leader_name], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, message: 'Project created successfully!' });
    });
});

// API: Get all user profiles
app.get('/api/users', (req, res) => {
    db.all(`SELECT * FROM users`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// API: Register a user profile
app.post('/api/users', (req, res) => {
    const { name, skills, bio } = req.body;
    const query = `INSERT INTO users (name, skills, bio) VALUES (?, ?, ?)`;
    db.run(query, [name, skills, bio], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, message: 'User profile created!' });
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
