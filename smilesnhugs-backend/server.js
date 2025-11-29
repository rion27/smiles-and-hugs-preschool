const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Database
const db = new sqlite3.Database('./preschool.db', (err) => {
    if (err) console.error(err.message);
    console.log('Connected to the preschool database.');
});

// --- TABLE 1: CONTACT MESSAGES (Matches contact_us.html) ---
db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    subject TEXT,
    message TEXT
)`);

// --- API 1: Handle Contact Form Submission ---
app.post('/submit-contact', (req, res) => {
    const { name, email, subject, message } = req.body;
    
    const sql = `INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)`;
    
    db.run(sql, [name, email, subject, message], function(err) {
        if (err) return console.error(err.message);
        
        res.json({ message: "Message received! We will email you shortly.", id: this.lastID });
        console.log(`New Contact Message from: ${name}`);
    });
});

// Start Server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});