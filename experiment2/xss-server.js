// experiment2/xss-server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database(':memory:');

// สร้างตาราง comments ใน memory
db.serialize(() => {
    db.run(`CREATE TABLE comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        comment TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    // ข้อมูลเริ่มต้น
    db.run(`INSERT INTO comments (name, comment) VALUES 
        ('Alice', 'สินค้าดีมาก แนะนำเลย!'),
        ('Bob', 'บริการประทับใจ จะมาซื้ออีก')`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// 🚨 VULNERABLE: XSS in comments
app.post('/comment', (req, res) => {
    const { name, comment } = req.body;
    
    // ❌ No sanitization - มีช่องโหว่ XSS
    db.run('INSERT INTO comments (name, comment) VALUES (?, ?)', [name, comment], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ success: true, id: this.lastID });
        }
    });
});

// Get comments (vulnerable output)
app.get('/comments', (req, res) => {
    db.all('SELECT * FROM comments ORDER BY created_at DESC', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

app.listen(3002, () => {
    console.log('🚨 XSS vulnerable server running on http://localhost:3002');
    console.log('Try XSS payload: <script>alert("XSS!")</script>');
});