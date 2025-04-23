import axios from 'axios';

const axios1 = axios.create({
    baseURL: 'http://localhost:5000', // Replace with your backend URL
});

export default axios1;