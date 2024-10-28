
import axios from 'axios';

// Create an Axios instance with the base URL of your Django backend
const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',  // Update if your Django server runs elsewhere
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
});

// Automatically attach tokens to requests if available
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;