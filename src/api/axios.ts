import axios from 'axios';

const api = axios.create({
  baseURL: 'https://biosheild-api.onrender.com', // ← paste your exact Render URL here
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;