const axios = require('axios');

const BACKEND_URL = 'https://bondkonnect-backend-production.up.railway.app';
const FRONTEND_ORIGIN = 'https://bondkonnect.up.railway.app';

async function testConnection() {
    console.log("--- STARTING CONNECTION TEST ---");
    
    try {
        // Test 1: Health Check (Using GET as confirmed in api.php)
        console.log(`1. Testing Backend Health (${BACKEND_URL}/api/health)...`);
        const health = await axios.get(`${BACKEND_URL}/api/health`);
        console.log("✅ Backend is REACHABLE (GET Success)");
        console.log("Health Status:", health.data);

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
        }
    }
}

testConnection();