// experiment5/http-server.js
const http = require('http');
const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ❌ HTTP Server - ไม่เข้ารหัส
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    console.log('🚨 HTTP LOGIN (ไม่เข้ารหัส):');
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    console.log('⚠️ ข้อมูลนี้ส่งแบบ plain text ใครดักจับก็อ่านได้!');
    
    res.json({
        success: true,
        message: 'Login successful (HTTP)',
        warning: 'ข้อมูลไม่ได้เข้ารหัส!'
    });
});

const httpServer = http.createServer(app);

httpServer.listen(3005, () => {
    console.log('🚨 HTTP Server (ไม่ปลอดภัย) running on http://localhost:3005');
});