
// 1. Load Environment Variables (Must be at the top)
require('dotenv').config();

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const nodemailer = require('nodemailer'); // Import Nodemailer

const app = express();
// Use the port Render gives us, or 3000 locally
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// --- DATABASE SETUP ---
const db = new sqlite3.Database('./preschool.db', (err) => {
    if (err) console.error(err.message);
    console.log('Connected to the preschool database.');
});

// Create Tables (If they don't exist)
db.run(`CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    parent_name TEXT,
    phone_number TEXT,
    message TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    subject TEXT,
    message TEXT
)`);

// --- EMAIL CONFIGURATION (Nodemailer) ---
// This 'transporter' is the postman that delivers the mail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Reads from .env
        pass: process.env.EMAIL_PASS  // Reads from .env
    }
});

// Helper function to send email
const sendNotificationEmail = (subject, textBody) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Send TO yourself
        subject: subject,
        text: textBody
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

// --- ROUTES ---

// 1. Submit Callback Request
app.post('/submit-form', (req, res) => {
    const { name, phone, message } = req.body;
    const sql = `INSERT INTO inquiries (parent_name, phone_number, message) VALUES (?, ?, ?)`;
    
    db.run(sql, [name, phone, message], function(err) {
        if (err) return console.error(err.message);
        
        // Send Email Alert
        sendNotificationEmail(
            `New Callback Request: ${name}`, 
            `Parent: ${name}\nPhone: ${phone}\nMessage: ${message}`
        );

        res.json({ message: "Request received! We will call you back.", id: this.lastID });
    });
});

// 2. Submit Contact Message
app.post('/submit-contact', (req, res) => {
    const { name, email, subject, message } = req.body;
    const sql = `INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)`;
    
    db.run(sql, [name, email, subject, message], function(err) {
        if (err) return console.error(err.message);
        
        // Send Email Alert
        sendNotificationEmail(
            `New Message: ${subject}`, 
            `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
        );

        res.json({ message: "Message received! We will email you shortly.", id: this.lastID });
    });
});

// 3. Admin View Route (Protected)
app.get('/admin/inquiries', (req, res) => {
    const adminPassword = req.headers['x-admin-password'];
    if (adminPassword !== process.env.ADMIN_PASS) {
        return res.status(403).json({ error: "Unauthorized" });
    }
    const sql = "SELECT * FROM messages ORDER BY id DESC";
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: rows });
    });
});

// --- ADMIN ROUTE: View all messages ---
app.get('/admin/inquiries', (req, res) => {
    // 1. Security Check (Simple Password)
    const adminPassword = req.headers['x-admin-password'];
    
   
    if (adminPassword !== process.env.ADMIN_PASS) {
        return res.status(403).json({ error: "Unauthorized: Wrong Password" });
    }

    // 2. Fetch Data from Database
    // "ORDER BY id DESC" ensures the newest messages appear at the top
    const sql = "SELECT * FROM messages ORDER BY id DESC";
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        // 3. Send the data back as JSON
        res.json({ data: rows });
    });
});

// Start Server
app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});