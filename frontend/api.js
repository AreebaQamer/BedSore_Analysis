// src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000', // Replace with your backend URL
});

// ✅ Correct
export const registerUser = (userData) => API.post('/api/auth/signup', userData);
export const loginUser = (userData) => API.post('/api/auth/login', userData);
