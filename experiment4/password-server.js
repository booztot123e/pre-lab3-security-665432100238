// experiment4/password-server.js
const express = require('express');
const crypto = require('crypto');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

class PasswordManager {
    // Hash password with salt
    hashPassword(password) {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.createHash('sha256').update(password + salt).digest('hex');
        return `${salt}:${hash}`;
    }
    
    // Verify password
    verifyPassword(password, storedHash) {
        const [salt, hash] = storedHash.split(':');
        const testHash = crypto.createHash('sha256').update(password + salt).digest('hex');
        return hash === testHash;
    }
    
    // Check password strength
    checkStrength(password) {
        let score = 0;
        let feedback = [];
        
        if (password.length >= 8) score += 1;
        else feedback.push('ใช้อย่างน้อย 8 ตัวอักษร');
        
        if (password.length >= 12) score += 1;
        else if (password.length >= 8) feedback.push('ควรใช้ 12 ตัวอักษรขึ้นไป');
        
        if (/[a-z]/.test(password)) score += 1;
        else feedback.push('ใส่ตัวอักษรเล็ก (a-z)');
        
        if (/[A-Z]/.test(password)) score += 1;
        else feedback.push('ใส่ตัวอักษรใหญ่ (A-Z)');
        
        if (/[0-9]/.test(password)) score += 1;
        else feedback.push('ใส่ตัวเลข (0-9)');
        
        if (/[^A-Za-z0-9]/.test(password)) score += 1;
        else feedback.push('ใส่อักขระพิเศษ (!@#$%^&*)');
        
        // Check for common weak patterns
        const commonPatterns = [
            /123456/,
            /password/i,
            /admin/i,
            /qwerty/i,
            /abc/i
        ];
        
        if (commonPatterns.some(pattern => pattern.test(password))) {
            score = Math.max(0, score - 2);
            feedback.push('หลีกเลี่ยงรูปแบบที่ง่ายต่อการเดา');
        }
        
        const levels = ['อ่อนแอมาก', 'อ่อนแอ', 'ปานกลาง', 'ดี', 'แข็งแรง', 'แข็งแรงมาก'];
        const strength = levels[Math.min(score, levels.length - 1)];
        
        return { score, strength, feedback, maxScore: 6 };
    }
}

const passwordManager = new PasswordManager();

// API endpoints
app.post('/hash-password', (req, res) => {
    const { password, method } = req.body;
    
    let result = {};
    
    switch (method) {
        case 'plain':
            result = {
                method: 'Plain Text',
                stored: password,
                security: 'อันตรายมาก - เห็นรหัสผ่านได้ทันที',
                color: 'red'
            };
            break;
            
        case 'md5':
            const md5Hash = crypto.createHash('md5').update(password).digest('hex');
            result = {
                method: 'MD5',
                stored: md5Hash,
                security: 'อันตราย - แตกได้ง่ายด้วย rainbow table',
                color: 'orange'
            };
            break;
            
        case 'sha256':
            const sha256Hash = crypto.createHash('sha256').update(password).digest('hex');
            result = {
                method: 'SHA-256',
                stored: sha256Hash,
                security: 'อันตราย - ยังแตกได้ด้วย rainbow table',
                color: 'orange'
            };
            break;
            
        case 'salted':
            const saltedHash = passwordManager.hashPassword(password);
            result = {
                method: 'SHA-256 + Salt',
                stored: saltedHash,
                security: 'ปลอดภัย - salt ป้องกัน rainbow table',
                color: 'green'
            };
            break;
    }
    
    res.json(result);
});

app.post('/check-strength', (req, res) => {
    const { password } = req.body;
    const strength = passwordManager.checkStrength(password);
    res.json(strength);
});

app.listen(3004, () => {
    console.log('🔐 Password security demo running on http://localhost:3004');
});