const axios = require('axios');

const testChat = async () => {
    try {
        const response = await axios.post('http://localhost:8002/chat', {
            uid: 'Y84O1MLwhMRTUISOeKHHJucdCBq2',
            message: 'Hello, I need some grocery advice'
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
};

testChat();