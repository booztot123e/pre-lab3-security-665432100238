// experiment4/password-demo.js
const crypto = require('crypto');

// Simulate different password storage methods
class PasswordDemo {
    
    // ❌ INSECURE: Plain text storage
    storePlainText(password) {
        console.log('🚨 Plain Text Storage:');
        console.log(`Password: ${password}`);
        console.log(`Stored as: ${password}`);
        console.log('Risk: Anyone with database access can see passwords!\n');
        return password;
    }
    
    // ❌ INSECURE: Simple hash (MD5)
    storeMD5(password) {
        const hash = crypto.createHash('md5').update(password).digest('hex');
        console.log('🚨 MD5 Hash Storage:');
        console.log(`Password: ${password}`);
        console.log(`Stored as: ${hash}`);
        console.log('Risk: MD5 is fast, vulnerable to rainbow table attacks!\n');
        return hash;
    }
    
    // ❌ INSECURE: SHA-256 without salt
    storeSHA256(password) {
        const hash = crypto.createHash('sha256').update(password).digest('hex');
        console.log('🚨 SHA-256 without Salt:');
        console.log(`Password: ${password}`);
        console.log(`Stored as: ${hash}`);
        console.log('Risk: Still vulnerable to rainbow table attacks!\n');
        return hash;
    }
    
    // ✅ SECURE: SHA-256 with salt
    storeSaltedHash(password) {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.createHash('sha256').update(password + salt).digest('hex');
        const stored = `${salt}:${hash}`;
        
        console.log('✅ Salted Hash Storage:');
        console.log(`Password: ${password}`);
        console.log(`Salt: ${salt}`);
        console.log(`Hash: ${hash}`);
        console.log(`Stored as: ${stored}`);
        console.log('Better: Salt prevents rainbow table attacks\n');
        return stored;
    }
    
    // ✅ MOST SECURE: bcrypt-style (simulation)
    storeBcrypt(password) {
        const salt = crypto.randomBytes(16).toString('hex');
        const iterations = 12; // Cost factor
        
        // Simulate bcrypt (in real app, use actual bcrypt library)
        let hash = password + salt;
        for (let i = 0; i < Math.pow(2, iterations); i++) {
            hash = crypto.createHash('sha256').update(hash).digest('hex');
        }
        
        const stored = `$2b$${iterations}$${salt}$${hash}`;
        
        console.log('✅ bcrypt-style Storage:');
        console.log(`Password: ${password}`);
        console.log(`Cost factor: ${iterations} (2^${iterations} = ${Math.pow(2, iterations)} iterations)`);
        console.log(`Stored as: ${stored}`);
        console.log('Most secure: Slow hashing resists brute force attacks\n');
        return stored;
    }
    
    // Demonstrate password cracking difficulty
    demonstrateCracking() {
        const password = 'password123';
        
        console.log('='.repeat(60));
        console.log('🔓 PASSWORD CRACKING DEMONSTRATION');
        console.log('='.repeat(60));
        
        // Store password using different methods
        const plain = this.storePlainText(password);
        const md5 = this.storeMD5(password);
        const sha256 = this.storeSHA256(password);
        const salted = this.storeSaltedHash(password);
        const bcrypt = this.storeBcrypt(password);
        
        console.log('💡 Cracking Difficulty Analysis:');
        console.log('1. Plain text: ❌ Instant (0 seconds)');
        console.log('2. MD5: ❌ Very fast (~1 second with rainbow tables)');
        console.log('3. SHA-256: ❌ Fast (~5 seconds with rainbow tables)');
        console.log('4. Salted hash: ⚠️ Slow (~hours with brute force)');
        console.log('5. bcrypt: ✅ Very slow (~years with brute force)\n');
        
        // Show why same passwords hash differently with salt
        console.log('🔐 Why Salt Matters:');
        const samePassword = 'admin123';
        const hash1 = this.storeSaltedHash(samePassword);
        const hash2 = this.storeSaltedHash(samePassword);
        console.log('Notice: Same password, different hashes due to random salt!');
    }
    
    // Password strength checker
    checkPasswordStrength(password) {
        let score = 0;
        let feedback = [];
        
        if (password.length >= 8) score += 1;
        else feedback.push('Use at least 8 characters');
        
        if (/[a-z]/.test(password)) score += 1;
        else feedback.push('Include lowercase letters');
        
        if (/[A-Z]/.test(password)) score += 1;
        else feedback.push('Include uppercase letters');
        
        if (/[0-9]/.test(password)) score += 1;
        else feedback.push('Include numbers');
        
        if (/[^A-Za-z0-9]/.test(password)) score += 1;
        else feedback.push('Include special characters');
        
        const strength = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][score];
        
        return { score, strength, feedback };
    }
}

// Run demonstration
const demo = new PasswordDemo();
demo.demonstrateCracking();

// Test password strength
console.log('='.repeat(60));
console.log('🔍 PASSWORD STRENGTH TESTING');
console.log('='.repeat(60));

const testPasswords = [
    'admin',
    'password',
    'Password123',
    'MySecure#Pass2024',
    'Tr0ub4dor&3'
];

testPasswords.forEach(pwd => {
    const result = demo.checkPasswordStrength(pwd);
    console.log(`Password: "${pwd}"`);
    console.log(`Strength: ${result.strength} (${result.score}/5)`);
    if (result.feedback.length > 0) {
        console.log(`Suggestions: ${result.feedback.join(', ')}`);
    }
    console.log('');
});

module.exports = PasswordDemo;