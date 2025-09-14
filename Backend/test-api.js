const axios = require('axios');

async function testAPI() {
    try {
        console.log('🧪 Testing API endpoints...');
        
        // Test health endpoint
        console.log('1. Testing health endpoint...');
        const healthResponse = await axios.get('http://127.0.0.1:8080/health');
        console.log('   ✅ Health endpoint:', healthResponse.data);
        
        // Test user registration
        console.log('\n2. Testing user registration...');
        const registerData = {
            username: 'testuser_' + Date.now(),
            name: 'Test User',
            password: 'testpass123',
            userType: 'farmer'
        };
        
        try {
            const registerResponse = await axios.post('http://127.0.0.1:8080/auth/register', registerData);
            console.log('   ✅ Registration successful:', registerResponse.data);
        } catch (error) {
            console.log('   ❌ Registration failed:', error.response?.data || error.message);
        }
        
        // Test user login
        console.log('\n3. Testing user login...');
        const loginData = {
            username: registerData.username,
            password: registerData.password
        };
        
        try {
            const loginResponse = await axios.post('http://127.0.0.1:8080/auth/login', loginData);
            console.log('   ✅ Login successful:', loginResponse.data);
        } catch (error) {
            console.log('   ❌ Login failed:', error.response?.data || error.message);
        }
        
        console.log('\n🎉 API testing completed!');
        
    } catch (error) {
        console.error('❌ API test failed:', error.message);
    }
}

testAPI();
