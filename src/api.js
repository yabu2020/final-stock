// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://almi-bakery.vercel.app/',
  timeout: 30000,
});

export default api;