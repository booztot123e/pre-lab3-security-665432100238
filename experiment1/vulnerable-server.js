// experiment1/vulnerable-server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database(path.join(__dirname, '../database/test.db'));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
// เพิ่ม CORS headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins for testing
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

// 🚨 VULNERABLE: SQL Injection endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // ❌ String concatenation - มีช่องโหว่ SQL Injection
    const query = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;
    console.log('Executing query:', query);

    db.get(query, (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        } else if (row) {
            res.json({ 
                success: true, 
                message: 'Login successful!',
                user: row 
            });
        } else {
            res.json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }
    });
});

app.listen(3001, () => {
    console.log('🚨 Vulnerable server running on http://localhost:3001');
    console.log("Try SQL injection: admin'; --");
});