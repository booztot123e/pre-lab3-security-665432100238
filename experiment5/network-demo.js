// experiment5/network-demo.js
const crypto = require('crypto');

class NetworkSecurityDemo {
    
    // จำลองการส่งข้อมูลผ่าน HTTP (ไม่เข้ารหัส)
    simulateHTTP(username, password) {
        console.log('🚨 HTTP TRANSMISSION (Plain Text):');
        console.log('='.repeat(50));
        
        const httpPacket = `
POST /login HTTP/1.1
Host: example.com
Content-Type: application/json
Content-Length: 45

{"username":"${username}","password":"${password}"}
        `.trim();
        
        console.log('📡 Data sent over network:');
        console.log(httpPacket);
        console.log('\n💡 Anyone monitoring network traffic can see:');
        console.log(`   Username: ${username}`);
        console.log(`   Password: ${password}`);
        console.log('\n❌ SECURITY RISK: Plain text transmission!\n');
        
        return httpPacket;
    }
    
    // จำลองการส่งข้อมูลผ่าน HTTPS (เข้ารหัส)
    simulateHTTPS(username, password) {
        console.log('✅ HTTPS TRANSMISSION (Encrypted):');
        console.log('='.repeat(50));
        
        // จำลองการเข้ารหัส (ในความเป็นจริงใช้ TLS)
        const plaintext = `{"username":"${username}","password":"${password}"}`;
        const encrypted = crypto.createHash('sha256')
            .update(plaintext + 'random-key')
            .digest('hex');
        
        const httpsPacket = `
TLS Handshake: [Certificate Exchange]
Encrypted Data: ${encrypted}
        `.trim();
        
        console.log('📡 Data sent over network:');
        console.log(httpsPacket);
        console.log('\n💡 Network monitoring shows only:');
        console.log('   ✅ Encrypted data (unreadable)');
        console.log('   ✅ Cannot see username/password');
        console.log('\n🔒 SECURE: Encrypted transmission!\n');
        
        return httpsPacket;
    }
    
    // เปรียบเทียบ HTTP vs HTTPS
    compareProtocols(username, password) {
        console.log('🔍 NETWORK SECURITY COMPARISON');
        console.log('='.repeat(60));
        console.log('Testing with credentials:');
        console.log(`Username: ${username}`);
        console.log(`Password: ${password}`);
        console.log('');
        
        this.simulateHTTP(username, password);
        this.simulateHTTPS(username, password);
        
        console.log('📊 COMPARISON SUMMARY:');
        console.log('='.repeat(60));
        console.log('HTTP:');
        console.log('  ❌ Data visible to anyone monitoring network');
        console.log('  ❌ Passwords sent in plain text');
        console.log('  ❌ Vulnerable to man-in-the-middle attacks');
        console.log('  ❌ No data integrity verification');
        console.log('');
        console.log('HTTPS:');
        console.log('  ✅ Data encrypted during transmission');
        console.log('  ✅ Passwords protected by encryption');
        console.log('  ✅ Certificate-based authentication');
        console.log('  ✅ Data integrity verification');
        console.log('');
    }
    
    // จำลองการโจมตี Man-in-the-Middle
    simulateMITMAttack() {
        console.log('👤 MAN-IN-THE-MIDDLE ATTACK SIMULATION');
        console.log('='.repeat(60));
        
        console.log('Scenario: Attacker intercepts network traffic');
        console.log('');
        
        console.log('🚨 HTTP (Vulnerable):');
        console.log('  1. User sends: POST /login {"username":"john","password":"secret123"}');
        console.log('  2. Attacker sees: Plain text data');
        console.log('  3. Attacker captures: Username=john, Password=secret123');
        console.log('  4. Result: ❌ CREDENTIALS STOLEN!');
        console.log('');
        
        console.log('🔒 HTTPS (Protected):');
        console.log('  1. User sends: Encrypted TLS data');
        console.log('  2. Attacker sees: Random encrypted bytes');
        console.log('  3. Attacker captures: Unreadable encrypted data');
        console.log('  4. Result: ✅ CREDENTIALS PROTECTED!');
        console.log('');
    }
}

// Run demonstrations
const demo = new NetworkSecurityDemo();

// Test with sample credentials
demo.compareProtocols('admin', 'mypassword123');
demo.simulateMITMAttack();

module.exports = NetworkSecurityDemo;