// experiment5/https-server.js
const https = require('https');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ HTTPS Server - เข้ารหัส
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    console.log('✅ HTTPS LOGIN (เข้ารหัส):');
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    console.log('🔒 ข้อมูลนี้ถูกเข้ารหัสระหว่างการส่ง!');
    
    res.json({
        success: true,
        message: 'Login successful (HTTPS)',
        security: 'ข้อมูลถูกเข้ารหัส!'
    });
});

// สร้าง self-signed certificate สำหรับทดสอบ
const createSelfSignedCert = () => {
    const certPath = path.join(__dirname, 'cert.pem');
    const keyPath = path.join(__dirname, 'key.pem');
    
    if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
        console.log('Creating self-signed certificate...');
        const { execSync } = require('child_process');
        
        try {
            // สร้าง self-signed certificate
            execSync(`openssl req -x509 -newkey rsa:4096 -keyout ${keyPath} -out ${certPath} -days 365 -nodes -subj "/C=TH/ST=Bangkok/L=Bangkok/O=Security Lab/OU=IT/CN=localhost"`);
            console.log('✅ Self-signed certificate created');
        } catch (error) {
            console.log('❌ OpenSSL not found. Creating dummy certificates...');
            
            // สร้างไฟล์ dummy สำหรับการทดสอบ
            fs.writeFileSync(keyPath, '-----BEGIN PRIVATE KEY-----\nDUMMY KEY FOR DEMO\n-----END PRIVATE KEY-----');
            fs.writeFileSync(certPath, '-----BEGIN CERTIFICATE-----\nDUMMY CERT FOR DEMO\n-----END CERTIFICATE-----');
        }
    }
    
    return { certPath, keyPath };
};

// ถ้าไม่มี certificate ให้สร้างขึ้นมา
const { certPath, keyPath } = createSelfSignedCert();

// สำหรับการทดสอบ ใช้ HTTP แทน HTTPS
const httpServer = require('http').createServer(app);

httpServer.listen(3006, () => {
    console.log('✅ HTTPS-style Server running on http://localhost:3006');
    console.log('📝 Note: ในการทดสอบจริง ควรใช้ HTTPS กับ SSL certificate');
});