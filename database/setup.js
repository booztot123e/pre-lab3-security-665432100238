// database/setup.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('test.db');

db.serialize(() => {
    // สร้างตาราง users
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        username TEXT UNIQUE,
        password TEXT,
        email TEXT
    )`);
    
    // เพิ่มข้อมูลทดสอบ
    db.run(`INSERT OR REPLACE INTO users VALUES 
        (1, 'admin', 'secret123', 'admin@example.com'),
        (2, 'john', 'password', 'john@example.com'),
        (3, 'jane', 'qwerty', 'jane@example.com')`);
    
    console.log('Database setup complete!');
});

db.close();