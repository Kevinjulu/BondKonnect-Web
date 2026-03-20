const axios = require('axios');

const BACKEND_URL = 'https://bondkonnect-backend-production.up.railway.app';
const FRONTEND_ORIGIN = 'https://bondkonnect.up.railway.app';

async function testConnection() {
    console.log("--- STARTING CONNECTION TEST ---");
    
    try {
        // Test 1: Health Check (Using POST as required by your API)
        console.log(`1. Testing Backend Health (${BACKEND_URL}/api/V1/auth/get-all-users)...`);
        const health = await axios.post(`${BACKEND_URL}/api/V1/auth/get-all-users`);
        console.log("✅ Backend is REACHABLE (POST Success)");

        // Test 2: CSRF Handshake
        console.log("2. Testing Sanctum CSRF Handshake...");
        const csrf = await axios.get(`${BACKEND_URL}/sanctum/csrf-cookie`, {
            withCredentials: true,
            headers: { 'Origin': FRONTEND_ORIGIN }
        });
        console.log("✅ Sanctum Handshake SUCCESSFUL");
        console.log("Response Headers:", csrf.headers['set-cookie'] ? "Cookies Received" : "No Cookies (Check CORS)");

    } catch (error) {
        console.error("❌ CONNECTION FAILED!");
        console.error("Error Message:", error.message);
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        } else {
            console.error("Cause: Is your 'php artisan serve' running at http://localhost:8000?");
        }
    }
}

testConnection();