const axios = require('axios');
console.log('Axios loaded successfully');
try {
    const response = axios.isCancel('something');
    console.log('Axios function check passed');
} catch (e) {
    console.error('Axios error:', e);
}
