
import axios from "axios";
import Config from "react-native-config";

export const pingServer = async (maxRetries = 3, delay = 3000) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`🌐 Attempt ${attempt} - Pinging Server...`);
            await axios.get(`${Config.FLASK_API_URL}/health`);
            console.log("  Server Active!");
            return true; // Server active
        } catch (error) {
            console.error(`⚠️ Attempt ${attempt} failed.`);
            if (attempt < maxRetries) {
                await new Promise((resolve) => setTimeout(resolve, delay));
            } else {
                console.error("❌ Server failed to respond after multiple attempts.");
                return false; // Server inactive
            }
        }
    }
};

export const retryRequest = async (apiCall, maxRetries = 3, delay = 3000) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await apiCall();
            return response; //   Successful response, no need to retry
        } catch (error) {
            // ⚠️ Handle HTTP errors (400, 403, etc.)
            if (error.response) {
                const { status } = error.response;

                // ❌ Known errors like 403, 400, etc. should NOT be retried
                if ([400, 401, 403, 404, 500].includes(status)) {
                    console.error(`❌ Error ${status}:`, error.response.data);
                    throw error; // Show error immediately without retrying
                }
            }

            // 🌐 Network/Server issues — Retry logic
            console.error(`⚠️ Retry attempt ${attempt} failed.`);
            if (attempt < maxRetries) {
                await new Promise((resolve) => setTimeout(resolve, delay));
            } else {
                console.error("❌ Server failed to respond after multiple attempts.");
                throw error; // Final attempt failed
            }
        }
    }
};

