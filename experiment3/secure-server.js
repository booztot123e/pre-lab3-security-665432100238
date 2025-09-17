// experiment3/secure-server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database(':memory:');

// Setup database
db.serialize(() => {
    db.run(`CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        username TEXT UNIQUE,
        password TEXT,
        email TEXT
    )`);
    
    db.run(`CREATE TABLE comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        comment TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    // Add test data
    const stmt = db.prepare('INSERT INTO users VALUES (?, ?, ?, ?)');
    stmt.run(1, 'admin', 'secret123', 'admin@example.com');
    stmt.run(2, 'john', 'password', 'john@example.com');
    stmt.finalize();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Input validation functions
function validateInput(input, maxLength = 100) {
    if (!input || typeof input !== 'string') {
        throw new Error('Invalid input');
    }
    
    if (input.length > maxLength) {
        throw new Error(`Input too long (max ${maxLength} characters)`);
    }
    
    // Check for suspicious patterns
    const dangerousPatterns = [
        /<script/gi,
        /javascript:/gi,
        /on\w+=/gi,
        /union\s+select/gi,
        /drop\s+table/gi,
        /insert\s+into/gi,
        /delete\s+from/gi
    ];
    
    for (const pattern of dangerousPatterns) {
        if (pattern.test(input)) {
            throw new Error('Input contains potentially dangerous content');
        }
    }
    
    return input.trim();
}

function sanitizeHTML(input) {
    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
}

// ✅ SECURE: Login with prepared statements
app.post('/login', (req, res) => {
    try {
        const username = validateInput(req.body.username, 50);
        const password = validateInput(req.body.password, 100);
        
        // ✅ Using prepared statement - ป้องกัน SQL injection
        const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
        
        console.log('Secure query:', query);
        console.log('Parameters:', [username, password]);
        
        db.get(query, [username, password], (err, row) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Database error' });
            } else if (row) {
                res.json({ 
                    success: true, 
                    message: 'Login successful!',
                    user: { id: row.id, username: row.username, email: row.email }
                });
            } else {
                res.json({ 
                    success: false, 
                    message: 'Invalid credentials' 
                });
            }
        });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// ✅ SECURE: Comment with sanitization
app.post('/comment', (req, res) => {
    try {
        const name = validateInput(req.body.name, 50);
        const comment = validateInput(req.body.comment, 500);
        
        // ✅ Sanitize HTML - ป้องกัน XSS
        const safeName = sanitizeHTML(name);
        const safeComment = sanitizeHTML(comment);
        
        db.run('INSERT INTO comments (name, comment) VALUES (?, ?)', 
               [safeName, safeComment], function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ 
                    success: true, 
                    id: this.lastID,
                    sanitized: true
                });
            }
        });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Get comments
app.get('/comments', (req, res) => {
    db.all('SELECT * FROM comments ORDER BY created_at DESC', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

app.listen(3003, () => {
    console.log('✅ Secure server running on http://localhost:3003');
    console.log('This server has security protections enabled');
});