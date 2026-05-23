import axios from 'axios';

const api = axios.create({
  // UPDATE THIS LINE WITH YOUR TRUE RENDER URL
  baseURL: 'https://biosheild-api.onrender.com', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;